import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { BlogsService } from 'src/app/shared/services/blogs.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {

  allBlogCategories: any[] = [];
  creatUpdateBlog: FormGroup = new FormGroup({});
  constructor(private blog: BlogsService) { 
    this.creatUpdateBlog = new FormGroup({
      "title":new FormControl(null),
      "content":new FormControl(null),
      "categoryId":new FormControl(null),
      "galleryImages":new FormArray([]),
      "tags":new FormArray([])
    })
  }

  ngOnInit(): void {
    this.getAllBlogCategories();
  }

  getAllBlogCategories(){
    this.blog.getAllBlogCategories()
    .toPromise()
    .then((res: any) => {
      if(res['code'] === 200){
        const result = res['result']?.data;
        this.allBlogCategories = result;
      }
    })
    .catch((error) => {
      console.error(error)
    })
  }

}
