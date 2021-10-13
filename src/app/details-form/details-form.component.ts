import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-details-form',
  templateUrl: './details-form.component.html',
  styleUrls: ['./details-form.component.css']
})
export class DetailsFormComponent {
  state = 0;
  properties = [];
  results = [];
  videoUrl = "";
  constructor(private apiService: ApiService, private cookieService: CookieService){
    if(this.cookieService.get('formDetails') == ''){
    this.apiService.getStoryBoard().subscribe(
      resp => {
        this.properties = resp.data;
    var detailsJson = JSON.stringify(resp.data); 
    this.cookieService.set('formDetails', detailsJson); //Set form details Cookie
        this.properties.forEach((property, i) => {
          this.results.push({ key: property.key, val: property.val });
        });
        this.state = 1;
      },
      Error => {
        this.state = 4;
      }
    );
    }
    else{
      var dataObj = JSON.parse(this.cookieService.get('formDetails'));
      this.properties = dataObj;
      this.properties.forEach((property, i) => {
        this.results.push({ key: property.key, val: property.val });
      });
      this.state = 1;
    }
  }

  getIcon(data: any){
    debugger
    var imgPath = "../../assets/icons/";
    switch(data){
      case "Address":
        return imgPath + "home-icon.svg";
        break;
      case "Email address":
        return imgPath + "at-icon.svg";
        break;
      case "First name":
        return imgPath + "person-icon.svg";
        break;
      case "Last name":
        return imgPath + "person-icon.svg";
        break;
      case "Contry":
        return imgPath + "flag-icon.svg";
        break;
    }
  }

  generateVideo() {
    // check all fields not empty
    for (var i = 0; i < this.results.length; i++)
      if (this.results[i].val.trim().length === 0) {
        alert('Please fill up all the fields');
        return;
      }

    //wait for video
    this.state = 2;

    let data = {
      storyboard_id: 31193,
      output: {
        video: [
          {
            video_type: 'mp4',
            quality: 26,
            height: 1280,
            crop_to_ratio: [16, 9]
          }
        ]
      },
      data: this.results
    };

    //send form
    this.apiService.postMessage(data).subscribe(
      resp => {
        this.videoUrl = resp.output.video[0].links.url;
        let checkVideoUrl = resp.output.video[0].links.check_status_url;
        let self = this;
        this.state = 2;

        //check when video is ready
        var id = setInterval(isVideoReady, 500);
        function isVideoReady() {
          self.apiService.getVideoStatus(checkVideoUrl).subscribe(resp => {
            if (resp.status == 'VIDEO_AVAILABLE') {
              clearInterval(id);
              self.addScript();
              self.state = 3;
            } else if (resp.status == 'ERROR' || resp.status == 'NOT_EXIST') {
              clearInterval(id);
              self.state = 4;
            }
          });
        }
      },
      Error => {
        this.state = 4;
      }
    );
  }

  addScript() {
    var player = document.createElement('div');
    player.id = 'idm_player';
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.innerHTML =
      ` var player_options = {
         interactive: true,
         src: "` +
      this.videoUrl +
      `",
         size: "hd",
         autoplay: true
       };
       idmPlayerCreate(player_options, "idm_player");`;

    document.getElementById('player_script').append(player, s);
  }

}
