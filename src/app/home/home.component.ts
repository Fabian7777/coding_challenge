import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  loaded: boolean = false;

  imagesList: any = [];
  imagesDisplayList: any = [];
  originalList : any = [];

  @ViewChild('titleEditable', { static: false }) EditableInput: any;
  @ViewChildren('titleEditable') Editables!: QueryList<ElementRef>;
  @ViewChildren('lblEditable') lblEditables!: QueryList<ElementRef>;

  @ViewChildren('btnConfirm') btnConfirmList!: QueryList<ElementRef>;
  @ViewChildren('btnReset') btnResetList!: QueryList<ElementRef>;


  today: number = Date.now();

  firstLoadedItems = 10;
  moreloaded: boolean = false;

  constructor(public authService: AuthService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.LoadImages();

  }


  LoadImages() {
    this.loaded = false;
    // Api connections
    this.authService.get_without_tokens('photos').then(
      (data: any) => {
        let myresponsedata: any = data;
        console.log(myresponsedata);
        this.loaded = true;

        //assign list
        this.imagesList = myresponsedata;
        this.originalList = myresponsedata;

        this.imagesDisplayList = this.imagesList.slice(0,this.firstLoadedItems);


      },
      (err) => {
        this.loaded = true;
        //parse error

        // display error
        console.log(err);
      }
    );
  }


  onSelectedClick(event: any, itemIndex: number) {
    //console.log(event);

    var mylist = this.Editables.toArray();
    //console.log(mylist);

    this.renderer.setStyle(
      mylist[itemIndex].nativeElement,
      'outline',
      'none',
      undefined
    );
    this.renderer.setStyle(
      mylist[itemIndex].nativeElement,
      'box-shadow',
      'none',
      undefined
    );
  }

  onEnterKeyPressed(itemIndex: number) {
    var mylist = this.lblEditables.toArray();
    console.log(mylist);

    // this.renderer.setStyle(mylist[itemIndex].nativeElement,"display","block");
  }

  loadMore() {
    this.moreloaded = true;

    //add list
    this.firstLoadedItems = this.firstLoadedItems + this.firstLoadedItems;
    this.imagesDisplayList = this.imagesList.slice(0, this.firstLoadedItems);

    setTimeout(() => {
      this.moreloaded = false;
    }, 3000); //close spinner after 3 seconds
  }

  isEven(n: number) {
    return n % 2 == 0;
  }

  isOdd(n: number) {
    return Math.abs(n % 2) == 1;
  }

  checkTitleChange(itemIndex:number){
    //get input value
    var mylist = this.Editables.toArray();


    var editedTitle = mylist[itemIndex].nativeElement.value;

   // console.log(editedTitle);

    //check if title has chnaged from the displaying array to reduce search through all arrays
    let item1 = this.imagesList.find((i: { title: string; }) => i.title === editedTitle );
    var btnList = this.btnConfirmList.toArray();
    var btn_reset_list = this.btnResetList.toArray();

   // console.log(item1);
    //control button
    if(item1 == undefined){

       // console.log(btnList);
      //Enable button
     // this.renderer.setAttribute(btnList[itemIndex].nativeElement,'disabled', 'false');
      this.renderer.removeAttribute(btnList[itemIndex].nativeElement,"disabled");
      this.renderer.removeAttribute(btn_reset_list[itemIndex].nativeElement,"disabled");

    }else{
      //disable button
      this.renderer.removeAttribute(btnList[itemIndex].nativeElement,"disabled");
    }


  }

  confirmUpdateClicked(itemIndex:number){
     //get input value
     var mylist = this.Editables.toArray();
     var editedTitle = mylist[itemIndex].nativeElement.value;

   //  console.log(editedTitle);

    //update list
    var item1: any = this.imagesDisplayList[itemIndex]

    console.log(item1);
    //control button
    if(item1 != undefined){

      item1.title = editedTitle;

    }
  }

  ResetBtnClicked(itemIndex:number){
    //get input value
    var mylist = this.Editables.toArray();
    var editedTitle = mylist[itemIndex].nativeElement.value;

  //  console.log(editedTitle);

   //update list
   var item1: any = this.originalList[itemIndex]

   console.log(item1);
   //control button
   if(item1 != undefined){

     item1.title = editedTitle;

   }
 }

}
