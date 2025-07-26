import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FinancialService {
  private apiUrl = 'http://127.0.0.1:8000/analyze'; // غيره لو محتاج

  constructor(private http: HttpClient) {}

  analyzePrompt(prompt: string): Observable<any> {
    return this.http.post(this.apiUrl, { prompt });
  }
}
