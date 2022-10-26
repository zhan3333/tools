import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolsComponent } from './tools.component';
import { ToolsRoutingModule } from './tools-routing.module';
import { ConverterComponent } from './converter/converter.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ToolsComponent, ConverterComponent],
  imports: [CommonModule, ToolsRoutingModule, SharedModule]
})
export class ToolsModule {}
