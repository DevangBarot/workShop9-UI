import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { EventsCategoryService } from 'src/app/shared/services/events-category.service';
import { EventsService } from 'src/app/shared/services/events.service';
import { UiService } from 'src/app/shared/services/ui.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {
  supportedFileTypes = ['image/jpg', 'image/jpeg', 'image/png'];
  allEventCategories: any[] = [];
  createUpdateEvent: FormGroup = new FormGroup({});
  sponsorDoc: FormControl = new FormControl();
  mediaDoc: FormControl = new FormControl();
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };
  uploadedDocument: any[] = [];
  get blogForm() {
    return new FormGroup({
      "title": new FormControl(null),
      "description": new FormControl(null),
      "categoryId": new FormControl(null),
      "startDateTime": new FormControl(null, [Validators.required]),
      "endDateTime": new FormControl(null, [Validators.required]),
      "isFeatured": new FormControl(false),
      "galleryImages": new FormArray([]),
      "sponsorsImages": new FormArray([]),
      "galleryVideos": new FormArray([new FormControl('')])
    })
  }
  constructor(
    private eventsService: EventsService,
    private eventsCategoryService: EventsCategoryService,
    private router: Router,
    private ui: UiService,
    private toaster: ToastrService
  ) {
    this.createUpdateEvent = this.blogForm;
  }

  ngOnInit(): void {
    this.getAllEventCategories();
  }

  getAllEventCategories() {
    this.eventsCategoryService.listActive()
      .toPromise()
      .then((res: any) => {
        if (res['code'] === 200) {
          const result = res['result']?.data;
          this.allEventCategories = result;
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }
  saveEvent() {
    const formData = this.createUpdateEvent.value;
    formData['sponsorsImages']=this.uploadedDocument.filter(p=> p.for==='sponsorDoc').map(p=> p.base64);
    formData['galleryImages']=this.uploadedDocument.filter(p=> p.for==='mediaDoc').map(p=> p.base64);
    console.log(formData)
    if (this.createUpdateEvent.invalid) {
      return
    }
    // this.eventsService.add(formData)
    //   .toPromise()
    //   .then((res) => {
    //     this.router.navigate([this.ui.blogs()])
    //   })
    //   .catch((error) => {
    //     console.error(error)
    //   })
  }
  resetEvent() {
    this.createUpdateEvent = this.blogForm;
  }
  async uploadDocument(event: any, data: any) {
    if (data === 'sponsorDoc') {
      this.sponsorDoc = new FormControl();
    } else {
      this.mediaDoc = new FormControl();
    }
    if (event.target.files && event.target.files.length > 0) {
      for (const iterator of event.target.files) {
        await this.multipleManageFile(iterator, data);
      }
    }
  }
  async multipleManageFile(file: any, t: any) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const index = _.indexOf(this.supportedFileTypes, file.type);
      if (index === -1) {
        this.toaster.error('Error', 'File format not supported');
        return;
      } else {
        const fileSize = this.supportedFileTypes.includes(this.supportedFileTypes[index]) ? 1 : 5;
        if ((file.size / 1000000) > fileSize) {
          this.toaster.error('Error', 'File size should be less than ' + fileSize.toString() + 'MB');
          return;
        } else {
          const filePreview = 'data:' + file.type + ';base64,' + (<string>reader.result).split(',')[1];
          this.uploadedDocument.push({ base64: filePreview, fileName: file.name, fileSize: file.size, fileType: file.type, for: t });
        }
      }
    };
  }
  get galleryVideos() {
    return (this.createUpdateEvent.get('galleryVideos') as FormArray);
  }
  addTags() {
    let tagListControl = this.galleryVideos;
    tagListControl.push(new FormControl(null));
  }

  removeTags(index: number) {
    let tagListControl = this.galleryVideos;
    tagListControl.removeAt(index);
    if (tagListControl.length === 0) {
      this.addTags();
    }
  }
}
