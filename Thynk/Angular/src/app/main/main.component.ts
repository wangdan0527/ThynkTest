import { Component, OnInit } from '@angular/core';
import { RestClientService } from '../service/rest-client.service'
import { Employee } from '../models/employee';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  employees: Employee[]  = []
  edit: boolean = false;
  currentModel: Employee
  
  constructor(
    private restClient: RestClientService
  ) { }

  ngOnInit(): void {
    this.loadEmployees()
  }

  loadEmployees = () => {
    this.restClient.getEmployees().subscribe((response: any) => {
      this.employees = response;
    })
  }

  onAddEmployee = () => {
    this.edit = true;
    this.currentModel = null;
  }

  onRemoveEmployee = (Id: string) => {
    if(confirm("Are you sure you want to delete?")) {
      this.restClient.deleteEmployee(Id).subscribe((_) => {
        this.loadEmployees();
      })
    }
  }

  onSelectEmployee = (employee: Employee) => {
    this.currentModel = employee;
    this.edit = false;
  }
  
}
