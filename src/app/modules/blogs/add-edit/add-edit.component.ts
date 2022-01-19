import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogsCategoryService } from 'src/app/shared/services/blogs-category.service';
import { BlogsService } from 'src/app/shared/services/blogs.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faMinus, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})

export class AddEditComponent implements OnInit {
  blogId: any;
  allBlogCategories: any[] = [];
  creatUpdateBlog: FormGroup;
  createBlogCategory: FormGroup;
  get blogForm() {
    return new FormGroup({
      "title": new FormControl(null),
      "content": new FormControl(null),
      "categoryId": new FormControl(null, Validators.required),
      "galleryImages": new FormArray([]),
      "tags": new FormArray([new FormControl('')])
    })
  }
  fontData = { add: faPlusSquare, minus: faMinus };
  get blogCategoryForm() {
    return new FormGroup({
      "title": new FormControl(null,[Validators.required])
    })
  }
  constructor(private blog: BlogsService, private blogCategory: BlogsCategoryService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private ui: UiService, private router: Router,
    private toaster: ToastrService) {
    this.creatUpdateBlog = this.blogForm;
    this.createBlogCategory =this.blogCategoryForm;
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
    this.blogCategory.listActive()
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
    if (this.blogId) {
      this.blog.update(formData)
        .toPromise()
        .then((res:any) => {
          this.toaster.success('Success', res['message'])
          this.router.navigate([this.ui.blogs()])
        })
        .catch((error) => {
          this.toaster.error('Error', error.error.message)
        })
    } else {
      this.blog.add(formData)
        .toPromise()
        .then((res:any) => {
          this.toaster.success('Success', res['message'])
          this.router.navigate([this.ui.blogs()])
        })
        .catch((error) => {
          this.toaster.error('Error', error.error.message)
        })
    }

  }

  resetBlog() {
    if (this.blogId) {
      this.creatUpdateBlog.addControl('id', new FormControl(null, Validators.required))
      this.creatUpdateBlog.removeControl('tags');
      this.creatUpdateBlog.addControl('tags', new FormArray([]));
      this.getBlogById(this.blogId)
    }else{
      this.creatUpdateBlog = this.blogForm;
    }
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
  back(){
    this.router.navigate([this.ui.blogs()])
  }
  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.createBlogCategory = this.blogCategoryForm;
    }, (reason) => {
      close();
    });
  }
  close() {
    this.modalService.dismissAll();
    this.createBlogCategory.reset();
  }
  saveBlogCategory() {
    const formData = this.createBlogCategory.getRawValue();
    formData['description']=formData['title'];
    if (this.createBlogCategory.invalid) {
      return
    }
    this.blogCategory.add(formData)
    .toPromise()
    .then((res:any) => {
      this.toaster.success('Success', res['message'])
      this.close();
      this.getAllBlogCategories();
    })
    .catch((error) => {
      this.toaster.error('Error', error.error.message)
    })
  }
}
