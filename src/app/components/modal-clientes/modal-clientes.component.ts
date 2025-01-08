import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FacturacionService } from 'src/app/services/facturacion.service';


@Component({
  selector: 'app-modal-clientes',
  templateUrl: './modal-clientes.component.html',
  styleUrls: ['./modal-clientes.component.scss'],
})
export class ModalClientesComponent  implements OnInit {

  @Input() clienteSeleccionado: any;
  @Input() codigoProforma: any;
  Clientes: any; 
  busquedaCliente: any;
  clientesFiltrados: any = [];
  Pagina:number = 0;


  constructor(private facturacionService: FacturacionService,
              private modalController: ModalController) { }

  ngOnInit() {
    this.obtenerClientes();
  }

  obtenerClientes(){
    this.facturacionService.obtenerClientes().subscribe(resp => {
      if(resp.code  == 200){   
        this.Clientes = resp.resultado.data;
        }
        this.clientesFiltrados = this.Clientes;
        this.cargarPagina();
        
    });
  }

  cargarPagina(){
    let cantidadPagina = 20;
    let inicio = this.Pagina;
    if(inicio != 0){
      inicio += cantidadPagina;
    }
    let final = inicio + cantidadPagina;
    if(this.Pagina == 0){
      this.busquedaCliente = this.clientesFiltrados.slice(inicio,final);
    }else{ 
      this.busquedaCliente = this.busquedaCliente.concat(this.clientesFiltrados.slice(inicio,final));
    }
    
    this.Pagina++;
  }

  cargarScroll(event: any) {
    
    if(this.busquedaCliente.length != this.Clientes.length){
      this.cargarPagina();
    }
    event.target.complete();
}

  cerrarModalClientes() {
    this.modalController.dismiss({
      clienteSeleccionado: this.clienteSeleccionado
    });
  }

  buscarCliente( event: any){
    const texto = event.target.value;
  
    if(texto && texto.trim() != ''){
      this.clientesFiltrados = this.Clientes.filter((cliente: any)=>{
        return (
          cliente.nombrejuridico.toLowerCase().indexOf(texto.toLowerCase())>-1 ||
          cliente.nombrecomercial.toLowerCase().indexOf(texto.toLowerCase())>-1 ||
          cliente.cedula.toLowerCase().includes(texto.toLowerCase()) ||
          cliente.codigo.toLowerCase().includes(texto.toLowerCase())
        );
        
      });
    }
    this.Pagina = 0;
    this.cargarPagina();
  }

  cambiarCliente(cliente: any){
    this.clienteSeleccionado = cliente;
    localStorage.setItem('ClienteSeleccionado', JSON.stringify(cliente));
    this.facturacionService.actualizarCliente(this.codigoProforma).subscribe(resp =>{

    });
    this.cerrarModalClientes();

  }

}
