import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { EventsCategoryService } from 'src/app/shared/services/events-category.service';
import { EventsService } from 'src/app/shared/services/events.service';
import { UiService } from 'src/app/shared/services/ui.service';
import * as _ from 'lodash';
import { faMinus, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {
  eventId: any;
  public startTimeConfig = { dateLabel: null, timeLabel: 'Start of Day', visible: 'BOTH', isRequired: true };
  supportedFileTypes = ['image/jpg', 'image/jpeg', 'image/png'];
  allEventCategories: any[] = [];
  createUpdateEvent: FormGroup = new FormGroup({});
  createEventCategory: FormGroup = new FormGroup({});
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
  uploadedSponsorDocument: any[] = [];
  uploadedDocument: any[] = [];
  startTime: string | undefined;
  endTime: string | undefined;
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
  fontData = { add: faPlusSquare, minus: faMinus };
  get eventCategoryForm() {
    return new FormGroup({
      "title": new FormControl(null, [Validators.required])
    })
  }
  constructor(
    private eventsService: EventsService,
    private eventsCategoryService: EventsCategoryService,
    private router: Router,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    public ui: UiService,
    private toaster: ToastrService
  ) {
    this.createUpdateEvent = this.blogForm;
    this.createEventCategory = this.eventCategoryForm;
  }

  ngOnInit(): void {
    this.getAllEventCategories();
    this.eventId = this.route.snapshot.params?.id;
    if (this.eventId) {
      this.createUpdateEvent.addControl('id', new FormControl(null, Validators.required))
      this.createUpdateEvent.removeControl('galleryVideos');
      this.createUpdateEvent.addControl('galleryVideos', new FormArray([]));
      this.getEventById(this.eventId)
    }
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
  getEventById(id: string) {
    this.eventsService.get(id)
      .toPromise()
      .then((res: any) => {
        if (res['code'] === 200) {
          const result = res['result'];
          if (result['galleryVideos'].length) {
            for (let i = 0; i < result['galleryVideos'].length; i++) {
              this.addTags()
            }
          }
          for (const iterator of result['galleryImages']) {
            this.uploadedDocument.push(iterator)
          }
          for (const iterator of result['sponsorsImages']) {
            this.uploadedSponsorDocument.push(iterator)
          }
          this.createUpdateEvent.reset(result);
          this.startTime = result['startDateTime'];
          this.endTime = result['endDateTime'];
          this.createUpdateEvent.get('galleryVideos')?.setValue(result['galleryVideos']);
          this.createUpdateEvent.get('id')?.setValue(result['_id']);
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }
  saveEvent() {
    const formData = this.createUpdateEvent.value;
    formData['sponsorsImages'] = this.uploadedDocument.map(p => p.uploadLink);
    formData['galleryImages'] = this.uploadedSponsorDocument.map(p => p.uploadLink);
    console.log(formData);
    if (this.createUpdateEvent.invalid) {
      return
    }
    if (this.eventId) {
      this.eventsService.update(formData)
        .toPromise()
        .then((res: any) => {
          this.toaster.success('Success', res['message']);
          this.router.navigate([this.ui.events()])
        })
        .catch((error) => {
          this.toaster.error('Error', error.error.message);
        })
    } else {
      this.eventsService.add(formData)
        .toPromise()
        .then((res: any) => {
          this.toaster.success('Success', res['message']);
          this.router.navigate([this.ui.events()])
        })
        .catch((error) => {
          this.toaster.error('Error', error.error.message);
        })
    }
  }
  resetEvent() {
    if (this.eventId) {
      this.createUpdateEvent.addControl('id', new FormControl(null, Validators.required))
      this.createUpdateEvent.removeControl('galleryVideos');
      this.createUpdateEvent.addControl('galleryVideos', new FormArray([]));
      this.getEventById(this.eventId)
    } else {
      this.createUpdateEvent = this.blogForm;
    }
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
          if (t === 'sponsorDoc') {
            this.uploadedSponsorDocument.push({ uploadLink: filePreview, fileName: file.name, fileSize: file.size, fileType: file.type });
          } else {
            this.uploadedDocument.push({ uploadLink: filePreview, fileName: file.name, fileSize: file.size, fileType: file.type });
          }

        }
      }
    };
  }
  get galleryVideosList() {
    return (this.createUpdateEvent.get('galleryVideos') as FormArray);
  }

  addTags() {
    let tagListControl = this.galleryVideosList;
    tagListControl.push(new FormControl(null));
  }

  removeTags(index: number) {
    let tagListControl = this.galleryVideosList;
    tagListControl.removeAt(index);
    if (tagListControl.length === 0) {
      this.addTags();
    }
  }
  onTimeSelection(utcTime: string, param: string): void {
    this.createUpdateEvent.get(param)?.setValue(utcTime);
  }
  back() {
    this.router.navigate([this.ui.events()])
  }
  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.createEventCategory = this.eventCategoryForm;
    }, (reason) => {
      close();
    });
  }
  close() {
    this.modalService.dismissAll();
    this.createEventCategory.reset();
  }
  saveEventCategory() {
    const formData = this.createEventCategory.getRawValue();
    formData['description'] = formData['title'];
    formData['colorCode'] = '#ffff';
    if (this.createEventCategory.invalid) {
      return
    }
    this.eventsCategoryService.add(formData)
      .toPromise()
      .then((res: any) => {
        this.toaster.success('Success', res['message']);
        this.close();
        this.getAllEventCategories();
      })
      .catch((error) => {
        this.toaster.error('Error', error.error.message);
      })
  }
}
