import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';


@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    
  ],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private itemService = inject(ItemService);

  form: FormGroup;
  items: Item[] = [];
  isEditMode = false;
  selectedItemId: number | null = null;
  displayedColumns = ['id', 'title', 'description', 'actions'];

  constructor() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.itemService.getItems().subscribe(items => {
      this.items = items;
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const item = this.form.value;
    if (this.isEditMode && this.selectedItemId !== null) {
      this.itemService.updateItem(this.selectedItemId, item).subscribe(() => {
        this.resetForm();
        this.getAll();
      });
    } else {
      this.itemService.createItem(item).subscribe(() => {
        this.resetForm();
        this.getAll();
      });
    }
  }

  onEdit(item: Item) {
    this.form.patchValue(item);
    this.isEditMode = true;
    this.selectedItemId = item.id ?? null;
  }

  onDelete(id: number) {
    this.itemService.deleteItem(id).subscribe(() => this.getAll());
  }

  resetForm() {
    this.form.reset();
    this.isEditMode = false;
    this.selectedItemId = null;
  }
}
