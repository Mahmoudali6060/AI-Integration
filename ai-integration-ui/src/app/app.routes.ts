import { Routes } from '@angular/router';
import { AnalyzerComponent } from './analyzer/analyzer.component';
import { ImageOcrComponent } from './image-ocr/image-ocr.component';
import { ItemsComponent } from './item/components/item-crud/items.component';

export const routes: Routes = [
  { path: 'analyzer', component: AnalyzerComponent },
  { path: 'ocr', component: ImageOcrComponent },
  { path: 'item', component: ItemsComponent },
  { path: '', redirectTo: 'ocr', pathMatch: 'full' },
];
