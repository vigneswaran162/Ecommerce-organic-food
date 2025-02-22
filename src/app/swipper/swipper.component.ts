import { Component } from '@angular/core';

declare var Swiper: any; // Declare Swiper globally


@Component({
  selector: 'app-swipper',
  imports: [],
  templateUrl: './swipper.component.html',
  styleUrl: './swipper.component.css'
})
export class SwipperComponent {

  ngAfterViewInit() {
    setTimeout(() => {
      new Swiper('.mySwiper', {
        slidesPerView: 'auto', // Adjust width dynamically
        spaceBetween: 20, // Space between slides
        loop: true,
        centeredSlides: true, // Center slides
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    }, 100);
  }






  
}

