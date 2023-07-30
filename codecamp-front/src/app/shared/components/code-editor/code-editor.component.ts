import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { EditorView, basicSetup } from 'codemirror';
import { javascriptLanguage } from '@codemirror/lang-javascript'
import { CodeLog, CodeLogger } from '../../classes/CodeLogger.class';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements AfterViewInit {
  @ViewChild('ideContainer')
  ideContainer!: ElementRef<HTMLDivElement>;

  @ViewChild('console')
  console!: ElementRef<HTMLDivElement>

  @Input() code = `console.log('Hello world')`
  @Input() expectedResult: any[] = [];
  @Input() tolerateMistakes: boolean = false;

  @Output() codeChange = new EventEmitter<string>();

  @Output() onCodeExecute = new EventEmitter<void>();
  @Output() onSuccess = new EventEmitter<CodeLog[]>();
  @Output() onError = new EventEmitter<CodeLog[]>();

  editor!: EditorView;
  logger: CodeLogger;

  constructor() {
    this.logger = new CodeLogger();
  }

  ngAfterViewInit(): void {
    this.editor = new EditorView({
      parent: this.ideContainer.nativeElement,
      extensions: [
        basicSetup,
        javascriptLanguage
      ],
      doc: this.code
    })
  }

  runCode() {
    const code = this.editor.state.doc.toString();

    this.onCodeExecute.emit();

    try {
      eval(code)
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }

    this.debugOutput();
    this.clearMemory();
  }

  debugOutput() {
    const codeLogs = this.logger.logs;

    if (codeLogs.every(l => l.type === 'message') || this.tolerateMistakes) {
      this.onSuccess.emit(codeLogs);
    } else {
      this.onError.emit(codeLogs);
    }

    this.console.nativeElement.innerText = this.logger.logs.map(l => l.value).join(', ')
  }

  clearMemory() {
    console.clear();
    this.logger.logs = [];
  }
}
