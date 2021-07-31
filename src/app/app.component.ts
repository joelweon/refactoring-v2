import {Component, OnInit} from '@angular/core';
import Invoices from './dummy/invoices.json';
import Plays from './dummy/plays.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'refactoring-v2';
  invoice = Invoices[0];
  plays = Plays;

  result: string = 'none';

  constructor() {}

  ngOnInit(): void {
    this.result = this.statement(this.invoice, this.plays);
  }

  // 공연료 청구서를 출력하는 코드
  statement(invoice: any, plays: any): string {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result =`청구 내역 (고객명: ${invoice.customer})\n`;
    const format = new Intl.NumberFormat("en-US", {style: "currency", currency:"USD", minimumFractionDigits: 2}).format;

    for (let perf of invoice.performances) {
      const play = plays[perf.playID];
      let thisAmount = amountFor(perf, play);

      // 포인트를 적립한다.
      volumeCredits += Math.max(perf.audience - 30, 0);
      // 희극 관객 5명마다 추가 포인트를 제공한다.
      if ("commedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

      // 청구 내역을 출력한다.
      result += `${play.name}: ${format(thisAmount/100)} (${perf.audience}석)\n`;
      totalAmount += thisAmount;
    }
    result += `\n총액: ${format(totalAmount/100)}\n`
    result += `적립 포인트: ${volumeCredits}점`
    ;
    return result;

    // 공연별 요금계산
    function amountFor(aPerformance: any, play: any) { // 값이 바뀌지 않는 변수는 매개변수로 전달
      let result = 0; // 명확한 이름으로 변경 (thisAmount -> result)

      switch (play.type) {
        case "tragedy": // 비극
          result = 40000;
          if (aPerformance.audience > 30) {
            result += 1000 * (aPerformance.audience - 30);
          }
          break;
        case "comedy": // 희극
          result = 30000;
          if (aPerformance.audience > 20) {
            result += 10000 + 500 * (aPerformance.audience - 20);
          }
          result += 300 * aPerformance.audience;
          break;
        default:
          throw new Error(`알 수 없는 장르: ${play.type}`);
      }
      return result;
    }
  }
}

