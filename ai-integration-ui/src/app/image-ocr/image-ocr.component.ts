import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-image-ocr',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './image-ocr.component.html',
  styleUrls: ['./image-ocr.component.css'],
})
export class ImageOcrComponent {
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  extractedText: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    if (this.selectedFile) {
      reader.readAsDataURL(this.selectedFile);
    }
  }

  upload() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    this.loading = true;

    this.http.post<any>('http://localhost:8000/image-to-text/', formData).subscribe(
      (res) => {
        this.extractedText = res.text;
        this.loading = false;
      },
      () => {
        this.extractedText = 'Error during OCR';
        this.loading = false;
      }
    );
  }
}
