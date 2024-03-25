import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private http: HttpClient) {}

  fetchData(): void {
    this.http.get('https://fakestoreapi.com/productsqqq').subscribe(
      (response) => {
        console.log('Received response:', response);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
}
