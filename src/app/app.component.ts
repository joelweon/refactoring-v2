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

      volumeCredits += volumeCreditsFor(perf); // 함수 추출 후 값을 누적

      // 청구 내역을 출력한다.
      result += `${playFor(perf).name}: ${format(amountFor(perf)/100)} (${perf.audience}석)\n`;
      totalAmount += amountFor(perf);
    }
    result += `\n총액: ${format(totalAmount/100)}\n`
    result += `적립 포인트: ${volumeCredits}점`;

    return result;

    // 포인트를 적립한다.
    function volumeCreditsFor(aPerformance: any) { // 명시적 변수로 변환 (perf -> aPerformance)
      let result = 0; // 명시적 변수로 변환 (volumeCredits -> result)
      result += Math.max(aPerformance.audience - 30, 0);
      if ("commedy" === playFor(aPerformance).type)
        result += Math.floor(aPerformance.audience / 5);
      return result;
    }

    // 공연별 요금계산
    function amountFor(aPerformance: any) { // 값이 바뀌지 않는 변수는 매개변수로 전달
      let result = 0; // 명확한 이름으로 변경 (thisAmount -> result)

      switch (playFor(aPerformance).type) {
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
          throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
      }
      return result;
    }

    function playFor(aPerformance: { playID: string | number; }) {
      return plays[aPerformance.playID];
    }
  }
}

