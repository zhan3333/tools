import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'anms-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConverterComponent implements OnInit {
  public file: File | undefined;

  constructor() {}

  ngOnInit(): void {}

  handleFileInput(event: Event) {
    if (event.target == null) {
      return;
    }
    const input = event.target as HTMLInputElement;
    if (input.files === null || input.files.length === 0) {
      return;
    }
    this.file = input.files[0];
  }
}
