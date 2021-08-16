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

  statement(invoice: any, plays: any): string {
    return this.renderPlainText(invoice, plays); // 본문 전체를 별도 함수로 추출
  }

  private renderPlainText(invoice: any, plays: any) {
    let result = `청구 내역 (고객명: ${invoice.customer})\n`;

    for (let perf of invoice.performances) {
      result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
    }
    result += `\n총액: ${usd(totalAmount())}\n`
    result += `적립 포인트: ${totalVolumeCredits()}점`;
    return result;

    function totalAmount() {
      let result = 0;
      for (let perf of invoice.performances) {
        result += amountFor(perf);
      }
      return result;
    }

    function totalVolumeCredits() {
      let result = 0;
      for (let perf of invoice.performances) {
        result += volumeCreditsFor(perf);
      }
      return result;
    }

    // 함수 변수(format)를 일반 함수(usd-함수이름변경)로 변경
    function usd(aNumber: any) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
      }).format(aNumber / 100);
    }

    // 포인트를 적립한다.
    function volumeCreditsFor(aPerformance: any) {
      let result = 0;
      result += Math.max(aPerformance.audience - 30, 0);
      if ("commedy" === playFor(aPerformance).type)
        result += Math.floor(aPerformance.audience / 5);
      return result;
    }

    // 공연별 요금계산
    function amountFor(aPerformance: any) {
      let result = 0;

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

