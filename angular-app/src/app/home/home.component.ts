import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { ElectionService } from '../election.service';
import { Election } from '../election';
@Component({
  selector: 'app-home',
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  elections: Election[] | undefined;
  
  constructor (private electionService: ElectionService) { }

  ngOnInit() {
    this.electionService.getAllElections().subscribe(
      (elections: Election[]) => {
        this.elections = elections;
        console.log('Elections loaded:', this.elections);
      })
  }
}
