import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogsService } from 'src/app/shared/services/blogs.service';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})

export class AddEditComponent implements OnInit {
  blogId: any;
  allBlogCategories: any[] = [];
  creatUpdateBlog: FormGroup;
  get blogForm() {
    return new FormGroup({
      "title": new FormControl(null),
      "content": new FormControl(null),
      "categoryId": new FormControl(null, Validators.required),
      "galleryImages": new FormArray([]),
      "tags": new FormArray([new FormControl('')])
    })
  }
  constructor(private blog: BlogsService,
    private route: ActivatedRoute,
    private ui: UiService, private router: Router) {
    this.creatUpdateBlog = this.blogForm;
  }

  get tagList() {
    return (this.creatUpdateBlog.get('tags') as FormArray);
  }

  ngOnInit(): void {
    this.getAllBlogCategories();
    this.blogId = this.route.snapshot.params?.id;
    if (this.blogId) {
      this.creatUpdateBlog.addControl('id', new FormControl(null, Validators.required))
      this.creatUpdateBlog.removeControl('tags');
      this.creatUpdateBlog.addControl('tags', new FormArray([]));
      this.getBlogById(this.blogId)
    }
  }

  getAllBlogCategories() {
    this.blog.getAllBlogCategories()
      .toPromise()
      .then((res: any) => {
        if (res['code'] === 200) {
          const result = res['result']?.data;
          this.allBlogCategories = result;
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  getBlogById(id: string) {
    this.blog.get(id)
      .toPromise()
      .then((res: any) => {
        if (res['code'] === 200) {
          const result = res['result'];
          if (result['tags'].length) {
            for (let i = 0; i < result['tags'].length; i++) {
              this.addTags()
            }
          }
          this.creatUpdateBlog.reset(result);
          this.creatUpdateBlog.get('tags')?.setValue(result['tags'])
          this.creatUpdateBlog.get('id')?.setValue(result['_id'])
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  saveBlog() {
    const formData = this.creatUpdateBlog.getRawValue();
    if (this.creatUpdateBlog.invalid) {
      return
    }
    if(this.blogId){
      this.blog.update(formData)
      .toPromise()
      .then((res) => {
        this.router.navigate([this.ui.blogs()])
      })
      .catch((error) => {
        console.error(error)
      })
    }else{
      this.blog.add(formData)
      .toPromise()
      .then((res) => {
        this.router.navigate([this.ui.blogs()])
      })
      .catch((error) => {
        console.error(error)
      })
    }
     
  }

  resetBlog() {
    this.creatUpdateBlog = this.blogForm;
  }

  addTags() {
    let tagListControl = this.tagList;
    tagListControl.push(new FormControl(null));
  }

  removeTags(index: number) {
    let tagListControl = this.tagList;
    tagListControl.removeAt(index);
    if (tagListControl.length === 0) {
      this.addTags();
    }
  }

}
