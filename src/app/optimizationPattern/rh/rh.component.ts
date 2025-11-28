import {ChangeDetectionStrategy, Component, OnInit, NgZone} from '@angular/core';
import {User, UsersService} from "../users.service";
import * as ChartJs from 'chart.js/auto';
import { List } from 'immutable';
@Component({
  selector: 'app-rh',
  templateUrl: './rh.component.html',
  styleUrls: ['./rh.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RhComponent implements OnInit {
  oddUsers: List<User> = List();
  evenUsers: List<User> = List();
  chart: any;
  constructor(private userService: UsersService, private ngzone: NgZone) {
    this.oddUsers = this.userService.getOddOrEven(true);
    this.evenUsers = this.userService.getOddOrEven();
  }

  ngOnInit(): void {
      this.ngzone.runOutsideAngular(() => {
        this.createChart();
    });
    }
  addUser(list: List<User>, newUser: string) {
    const user = this.userService.addUser(list, newUser);
    if (user.age % 2) {
      this.oddUsers = this.oddUsers.unshift(user);
    } else {
      this.evenUsers = this.evenUsers.unshift(user);
    }
    this.updateChart();
  }

  updateChart() {
    this.ngzone.runOutsideAngular(() => {
      this.chart.data.datasets[0].data = [this.oddUsers.size, this.evenUsers.size];
      this.chart.update();
    });
  }

  createChart(){
    const data = [
      { users: 'Workers', count: this.oddUsers.size },
      { users: 'Boss', count: this.evenUsers.size },
    ];
    this.chart = new ChartJs.Chart("MyChart",
    {
      type: 'bar',
        data: {
          labels: data.map(row => row.users),
        datasets: [
        {
          label: 'Entreprise stats',
          data: data.map(row => row.count)
        }
      ]
    }
    });
  }
}
