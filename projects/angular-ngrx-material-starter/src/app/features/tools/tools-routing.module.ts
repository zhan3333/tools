import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ToolsComponent } from './tools.component';
import { ConverterComponent } from './converter/converter.component';

const routes: Routes = [
  {
    path: '',
    component: ToolsComponent,
    data: { title: 'anms.menu.tools' }
  },
  {
    path: 'converter',
    component: ConverterComponent,
    data: { title: '转换器' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolsRoutingModule {}
