import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import Echo from 'laravel-echo';

@Injectable({
  providedIn: 'root',
})
export class EchoService {
  public echo: Echo;

  constructor() {
    this.echo = new Echo({
      broadcaster: 'socket.io',
      host: `${window.location.hostname}:555`, // Cambia el puerto si es necesario
      client: io
    });
  }

  public listen(channel: string, event: string, callback: (data: any) => void) {
    this.echo.channel(channel).listen(event, callback);
  }

  public leave(channel: string) {
    this.echo.leave(channel);
  }
}