import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { EditorView, basicSetup } from 'codemirror';
import { javascriptLanguage } from '@codemirror/lang-javascript'

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements AfterViewInit {
  @ViewChild('ideContainer')
  ideContainer!: ElementRef<HTMLDivElement>;

  editor!: EditorView;

  ngAfterViewInit(): void {
    this.editor = new EditorView({
      parent: this.ideContainer.nativeElement,
      extensions: [
        basicSetup,
        javascriptLanguage
      ],
      doc: `console.log('Hello world')`
    })
  }

  runCode() {
    const document = this.editor.state.doc;
    const code = document.toString()

    eval(code)
  }
}
