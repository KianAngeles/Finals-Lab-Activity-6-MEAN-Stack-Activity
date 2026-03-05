import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'booksapp';
  readonly APIUrl = 'http://localhost:5038/api/books/';

  books: any[] = [];
  editingId: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.refreshBooks();
  }

  refreshBooks() {
    this.http.get<any[]>(this.APIUrl + 'GetBooks').subscribe(data => {
      this.books = data;
    });
  }

  private getInputValues() {
    const title = (document.getElementById('newBook') as HTMLInputElement).value;
    const description = (document.getElementById('newDesc') as HTMLInputElement).value;
    const price = (document.getElementById('newPrice') as HTMLInputElement).value;
    return { title, description, price };
  }

  clearInputs() {
    (document.getElementById('newBook') as HTMLInputElement).value = '';
    (document.getElementById('newDesc') as HTMLInputElement).value = '';
    (document.getElementById('newPrice') as HTMLInputElement).value = '';
  }

  // ADD ONLY
  addBook() {
    const { title, description, price } = this.getInputValues();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);

    this.http.post(this.APIUrl + 'AddBook', formData).subscribe(data => {
      alert(data);
      this.clearInputs();
      this.refreshBooks();
    });
  }

  // Click Edit: fill inputs + show Edit form
  editBook(book: any) {
    (document.getElementById('newBook') as HTMLInputElement).value = book.title ?? '';
    (document.getElementById('newDesc') as HTMLInputElement).value = book.desc ?? '';
    (document.getElementById('newPrice') as HTMLInputElement).value =
      book.price != null ? String(book.price) : '';

    this.editingId = String(book.id);
  }

  // UPDATE ONLY (called by Update button)
  updateBook() {
    if (!this.editingId) return;

    const { title, description, price } = this.getInputValues();

    const formData = new FormData();
    formData.append('id', this.editingId);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);

    this.http.put(this.APIUrl + 'UpdateBook', formData).subscribe(data => {
      alert(data);
      this.editingId = null;
      this.clearInputs();
      this.refreshBooks();
    });
  }

  cancelEdit() {
    this.editingId = null;
    this.clearInputs();
  }

  deleteBook(id: any) {
    this.http.delete(this.APIUrl + 'DeleteBook?id=' + id).subscribe(data => {
      alert(data);
      if (this.editingId === String(id)) this.cancelEdit();
      this.refreshBooks();
    });
  }
}
