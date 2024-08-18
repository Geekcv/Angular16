import { Component } from '@angular/core';

@Component({
  selector: 'app-directives',
  templateUrl: './directives.component.html',
  styleUrl: './directives.component.css'
})
export class DirectivesComponent {
[x: string]: any;

  // ngif and else and then
  // isvalid:boolean=true;
  // changevalue(valid: boolean){
  //   this.isvalid=valid;
  // }

  // switch
  // name="abhishek"

  //for

  // students:any[]=[
  //   {
  //     'name':'abhishek'
  //   },
  //   {
  //     'name':'kirti'
  //   },{
  //     'name':'nagin'
  //   },{
  //     'name':'vandan'
  //   },{
  //     'name':'vijay'
  //   },
  // ]



  // track
//   students:any[];


//   constructor(){
//     this.students=[
//           {
//             studentid:1,
//             name:"abhishek",
//             gender:"male",
//             age:"21",
//             course:"mca"
//           },
//           {
//             studentid:2,
//             name:"kirt",
//             gender:"male",
//             age:"24",
//             course:"bca"
//           },{
//             studentid:3,
//             name:"sunil",
//             gender:"male",
//             age:"25",
//             course:"mca"
//           },
//           {
//             studentid:4,
//             name:"arun",
//             gender:"male",
//             age:"12",
//             course:"school"
//           },
//     ]
//   }

//   getmorestudnt():void{

//     this.students=[
//       {
//         studentid:1,
//         name:"abhishek",
//         gender:"male",
//         age:"21",
//         course:"mca"
//       },
//       {
//         studentid:2,
//         name:"kirt",
//         gender:"male",
//         age:"24",
//         course:"bca"
//       },{
//         studentid:3,
//         name:"sunil",
//         gender:"male",
//         age:"25",
//         course:"mca"
//       },
//       {
//         studentid:4,
//         name:"arun",
//         gender:"male",
//         age:"12",
//         course:"school"
//       },
//       {
//         studentid:5,
//         name:"harun",
//         gender:"male",
//         age:"10",
//         course:"school"
//       },
// ]

//   }

//   trackbystudentid(index:number,student:any):string{
//     return student.studentid;
//   }


//grouping

// countrydetails:any[]=[
//   {
//     'country':'india',
//     'people':[
//       {
//         'name':'abhi'
//       },
//       {
//         'name':'kirti'
//       }
//     ]
//   },
//   {
//     'country':'canda',
//     'people':[
//       {
//         'name':'cabhi'
//       },
//       {
//         'name':'ckirti'
//       }
//     ]
//   },{
//     'country':'us',
//     'people':[
//       {
//         'name':'uabhi'
//       },
//       {
//         'name':'ukirti'
//       }
//     ]
//   }
// ]


//ng style

people:any[]=[
  {
    'name':'abhi',
    'country':'india'
  },
  {
    'name':'kirit',
    'country':'india'
  },{
    'name':'suni',
    'country':'us'
  },{
    'name':'viya',
    'country':'us'
  },{
    'name':'arun',
    'country':'india'
  },
];

getcolor(country: string): string {
  switch (country) {
    case 'india':
      return 'green';
    case 'us':
      return 'red';
    default:
      return 'blue'; // Default return value
  }
}




}
