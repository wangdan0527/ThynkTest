import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Employee } from '../../models/employee';
import { RestClientService } from '../../service/rest-client.service'
import { StorageService } from '../../service/storage.service';

const URL_REG = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})

export class DetailComponent implements OnInit {

  @Input() edit: boolean;
  @Input() model: Employee = null;
  @Output('reload') reload: EventEmitter<any> = new EventEmitter();

  @ViewChild('fileInput') fileInput?: ElementRef;
  @ViewChild('plan') plan: ElementRef;

  beingSubmit = false;
  employeeForm?: FormGroup;
  imageChanged = false;
  imageUploaded = false;

  constructor(
    private formBuilder: FormBuilder,
    private restClient: RestClientService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.employeeForm = this.formBuilder.group({
      Name: ['', Validators.required],
      Title: ['', Validators.required],
      Motto: ['', Validators.required],
      Hobbies: ['', Validators.required],
      Hometown: ['', Validators.required],
      Blog: ['', [Validators.required, Validators.pattern(URL_REG)]],
    });
  }

  onSave = () => {
    if(this.employeeForm.valid) {
      this.beingSubmit = true;
      if(this.imageChanged) {
        let uid = Math.random().toString(36).slice(2);
        const { downloadUrl$, uploadProgress$ } = this.storageService.uploadFileAndGetMetadata("/images/" + uid, this.fileInput?.nativeElement.files[0]);
        downloadUrl$.subscribe((downloadUrl: any) => {
          this.update(downloadUrl)
        })
      }
      else {
        this.update(this.model.ProfileImage)
      }
    }
  }

  update(downloadUrl: string) {
    if(this.model) {
      this.restClient.editEmployee(
        this.model.Id,
        this.employeeForm.value.Name,
        this.employeeForm.value.Title,
        this.employeeForm.value.Blog,
        downloadUrl,
        this.employeeForm.value.Motto,
        this.employeeForm.value.Hobbies,
        this.employeeForm.value.Hometown,
      ).subscribe((response: any) => {
        this.edit = false;
        this.reload.emit()        
        this.beingSubmit = false;
      })
    }
    else {
      this.restClient.createEmployee(
        this.employeeForm.value.Name,
        this.employeeForm.value.Title,
        this.employeeForm.value.Blog,
        downloadUrl,
        this.employeeForm.value.Motto,
        this.employeeForm.value.Hobbies,
        this.employeeForm.value.Hometown,
      ).subscribe((response: any) => {
        this.edit = false;
        this.reload.emit()
        this.beingSubmit = false;
      })
    }

  }

  onLoadImage = () => {
    this.fileInput?.nativeElement.click();
  }

  onUploadImage(res: any) {
    if (this.fileInput?.nativeElement.files.length > 0) {
      this.imageChanged = true;
      var reader = new FileReader();
      reader.onloadend = () => {
        this.plan.nativeElement.src = reader.result;
    };
      reader.readAsDataURL(this.fileInput?.nativeElement.files[0]);
    }
  }

  ngOnChanges(changes: any) {
    let currentModel = changes.model.currentValue;
    if(this.employeeForm) {
      this.employeeForm.setValue({
        Name: currentModel? currentModel.Name: '',
        Title: currentModel? currentModel.Title: '',
        Motto: currentModel? currentModel.Motto: '',
        Hobbies: currentModel? currentModel.Hobbies: '',
        Hometown: currentModel? currentModel.Hometown: '',
        Blog: currentModel? currentModel.Blog: ''
      });
      this.imageChanged = false;
      this.imageUploaded = true;
    }
  }

  onEdit() {
    this.edit = true
  }
}
