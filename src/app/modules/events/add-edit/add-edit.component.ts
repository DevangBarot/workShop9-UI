import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { EventsCategoryService } from 'src/app/shared/services/events-category.service';
import { EventsService } from 'src/app/shared/services/events.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {

  allEventCategories: any[] = [];
  createUpdateEvent: FormGroup = new FormGroup({});
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
    uploadUrl: 'v1/image',
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };
  constructor(
    private eventsService: EventsService,
    private eventsCategoryService: EventsCategoryService
    ) { 
    this.createUpdateEvent = new FormGroup({
      "title":new FormControl(null),
      "description":new FormControl(null),
      "categoryId":new FormControl(null),
      "startDateTime":new FormControl(null,[Validators.required]),
      "endDateTime":new FormControl(null,[Validators.required]),
      "isFeatured":new FormControl(false),
      "galleryImages":new FormArray([]),
      "sponsorsImages":new FormArray([]),
      "galleryVideos":new FormArray([])
    })
  }

  ngOnInit(): void {
    this.getAllEventCategories();
  }

  getAllEventCategories(){
    this.eventsCategoryService.listActive()
    .toPromise()
    .then((res: any) => {
      if(res['code'] === 200){
        const result = res['result']?.data;
        this.allEventCategories = result;
      }
    })
    .catch((error) => {
      console.error(error)
    })
  }

}
