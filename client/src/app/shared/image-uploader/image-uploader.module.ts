import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ImageUploaderComponent } from './image-uploader.component';
import { NgFileSelectDirective } from 'ngx-uploader';
import { NgFileDropDirective } from 'ngx-uploader';

@NgModule({
    imports: [ RouterModule, CommonModule ],
    declarations: [ ImageUploaderComponent, NgFileSelectDirective, NgFileDropDirective ],
    exports: [ ImageUploaderComponent ]
})

export class ImageUploaderModule {}
