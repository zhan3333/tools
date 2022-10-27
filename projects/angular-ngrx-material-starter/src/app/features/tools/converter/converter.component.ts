import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../core/notifications/notification.service';
import { invoke } from '@tauri-apps/api/tauri';
import { open, save } from '@tauri-apps/api/dialog';
import { basename, dirname, extname, videoDir } from '@tauri-apps/api/path';
import { open as shellOpen } from '@tauri-apps/api/shell';

@Component({
  selector: 'anms-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ConverterComponent implements OnInit {
  public allowConvertToTypes: { name: string; value: string }[] = [
    {
      name: 'mp4',
      value: 'mp4'
    },
    {
      name: 'mp3',
      value: 'mp3'
    }
  ];
  public form = new FormGroup({
    file: new FormControl('', [Validators.required]),
    toType: new FormControl('', [Validators.required])
  });
  public outFiles: { path: string; date: Date }[] = [];

  constructor(private notification: NotificationService) {}

  ngOnInit(): void {}

  async selectFile() {
    const selected = await open({
      defaultPath: await videoDir(),
      filters: [
        {
          name: 'Videos',
          extensions: ['avi', 'mp4']
        }
      ]
    });
    if (Array.isArray(selected)) {
      // user selected multiple files
    } else if (selected === null) {
      // user cancelled the selection
    } else {
      this.form.get('file')?.setValue(selected);
    }
  }

  async confirm() {
    const inFile = this.form.get('file')?.value as string;
    const newExt = this.form.get('toType')?.value as string;
    const inFileBasename = await basename(
      inFile,
      '.' + (await extname(inFile))
    );
    const saveDir = (await dirname(inFile)) + '/' + inFileBasename;
    console.log('save dir', saveDir);
    const savePath = await save({
      title: '保存文件到',
      defaultPath: saveDir,
      filters: [
        {
          name: inFileBasename,
          extensions: [newExt]
        }
      ]
    });
    if (savePath.length === 0) {
      this.notification.warn('已取消');
      return;
    }
    invoke('convert_video_format', {
      inFile: this.form.get('file')?.value,
      outFile: savePath
    })
      .then((resp: any) => {
        console.log('convert response', resp);
        this.notification.success('转换完成');
        this.outFiles = [
          {
            path: savePath,
            date: new Date()
          },
          ...this.outFiles
        ];
      })
      .catch((err) => this.notification.error('转换失败: ' + err));
  }

  async openFile(path: string) {
    await shellOpen(await dirname(path));
  }

  reset() {
    this.form.reset();
  }
}
