# Refactoring_v2 by Martin Fowler

다양한 연극을 외주로 받아서 공연하는 극단이 있다.

연극의 장르와 관객 규모를 기초로 비용을 책정한다.  
현재는 비극(tragedy)과 희극(comedy)만 공연한다.

공연료와 별개로 포인트를 지급해서 다음번 의뢰 시 공연료를 할인 받을 수 있다.

> 아래 페이지는 ch.1 첫 번째 예시에 대한 페이지를 말함.

## 함수 추출하기(6.1) - p33
amountFor()

## 임시 변수를 질의 함수로 바꾸기(7.4) - p35
play, thisAmount 변수 제거

## 변수 인라인 처리(6.4) - p36
~~const play = playFor(perf);~~  
let thisAmount = amountFor(perf, ~~play~~);  
-->  
`let thisAmount = amountFor(perf, playFor(perf);)`

play -> playFor(), thisAmount -> amountFor()

## 함수 선언 바꾸기(6.5) - p37
```javascript
function amountFor(aPerformance: any, play: any) {
    let result = 0;

    switch (play.type) {
      //...
    }
}
```
-->

```javascript
// 공연별 요금계산
function amountFor(aPerformance: any) { // 값이 바뀌지 않는 변수는 매개변수로 전달
    let result = 0; // 명확한 이름으로 변경 (thisAmount -> result)

    switch (playFor(aPerformance).type) {// play변수-> playFor()로 바꾸기
        //...
    }
}
```

## 반복문 쪼개기(8.7) - p44
1. `반복문 쪼개기(8.7)`로 변수 값을 누적시키는 부분을 분리한다.
2. `문장 슬라이드하기(8.6)`로 변수 초기화 문장을 변수 값 누적 코드 바로 앞으로 옮긴다.
3. `함수 추출하기(6.1)`로 적립 포인트 계산 부분을 별도 함수로 추출한다.
4. `변수 인라인하기(6.4)`로 `volumeCredits` 변수를 제거한다.
