import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { EditorView, basicSetup } from 'codemirror';
import { javascriptLanguage } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

import { CodeLog, CodeLogger } from '../../classes/CodeLogger.class';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements AfterViewInit {
  @ViewChild('ideContainer')
  ideContainer!: ElementRef<HTMLDivElement>;

  @Input() identifier: string | number = 0;
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
        oneDark,
        javascriptLanguage
      ],
      doc: this.code
    })
  }

  runCode() {
    const code = this.editor.state.doc.toString();

    this.onCodeExecute.emit();
    this.clearMemory();

    try {
      eval(code)
    } catch (err) {
      const error = err as Error;
      const message = `${error?.name ? error.name + ' - ' : ''} ${error.message}`
      console.error(message);
    }

    this.debugOutput();
  }

  saveCode() {
    const id = this.identifier.toString();
    const code = this.editor.state.doc;

    localStorage.setItem(id, JSON.stringify(code));
  }

  debugOutput() {
    const codeLogs = this.logger.logs;

    if (!this.tolerateMistakes) {
      if (codeLogs.some(log => log.type === 'error') || codeLogs.length !== this.expectedResult.length) {
        this.debugError();
        return;
      }

      if (codeLogs.some(registeredLog => !this.expectedResult.includes(registeredLog.value))) {
        this.debugError();
        return;
      }
    }

    this.onSuccess.emit(codeLogs);
  }

  debugError() {
    const codeLogs = this.logger.logs;
    this.onError.emit(codeLogs);
  }

  clearMemory() {
    console.clear();
    this.logger.logs = [];
  }
}
