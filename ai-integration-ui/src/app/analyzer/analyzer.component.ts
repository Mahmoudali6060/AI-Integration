import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
// import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-analyzer',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './analyzer.component.html',
  styleUrls: ['./analyzer.component.css'],
})
export class AnalyzerComponent {
  promptText = '';
  resultText = '';
  loading = false;

  chartType: ChartType = 'pie';

  chartData: ChartData<'pie'> = {
    labels: ['Net Profit', 'Total Cost', 'Total Revenue'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#4CAF50', '#F44336', '#2196F3'],
      },
    ],
  };

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  // englishText: any;
  // arabicText: any;

  constructor(private http: HttpClient) {}

  analyzeText() {
    if (!this.promptText.trim()) return;

    this.loading = true;
    this.resultText = '';

    this.http
      .post<any>('http://127.0.0.1:8000/analyze', {
        prompt: this.promptText,
      })
      .subscribe({
        next: (res) => {
          // this.resultText = res.result;

          this.resultText = res.result_ar;
          // this.arabicText = res.result_ar;

          this.loading = false;
          let result = res.result_en;
          const cost = this.extractAmount('Initial Investment', result);
          const profit = this.extractAmount('Net Profit', result);
          const revenue = this.extractAmount('Total Revenue', result);

          this.chartData.labels = ['Net Profit', 'Total Cost', 'Revenue'];
          this.chartData.datasets[0].data = [profit, cost, revenue];
          // console.log('📝 GPT Output:', res.result);
        },
        error: (err) => {
          this.resultText = '❌ Error: ' + (err.error?.error || err.message);
          this.loading = false;
        },
      });
  }

  copyResult() {
    navigator.clipboard.writeText(this.resultText);
  }

  downloadPDF() {
    const blob = new Blob([this.resultText], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'financial-analysis.pdf';
    link.click();
    URL.revokeObjectURL(url);
  }

  useMic() {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event: any) => {
      this.promptText = event.results[0][0].transcript;
    };
    recognition.start();
  }

  extractAmount(label: string, text: string): number {
    const regex = new RegExp(`${label}.*?([\\d,]+)\\s*EGP`, 'i');
    const match = text.match(regex);
    console.log(`🧪 ${label} →`, match);
    return match ? parseInt(match[1].replace(/,/g, '')) : 0;
  }
}
