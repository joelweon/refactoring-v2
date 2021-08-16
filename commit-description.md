## 임시 변수 제거 후 인라인 처리

### play 변수 제거
인라인 처리 `playFor()` 
`amountFor()`의 매개변수 `play`는 변경되는 값은 아니다.

### thisAmount 변수 제거
인라인 처리 `amountFor(perf)`

공연 조회 loop 당 1회 -> loop 당 3회  
성능 큰영향x, 리팩터링된 코드는 성능 개선이 훨씬 쉬워짐  
=> 추출 작업 전 지역변수를 먼저 없앰. - 신경써야할 유효범위가 줄음

---

### 적립 포인트 계산 코드 추출하기
`volumeCreditsFor()` 새로 추출한 함수

---

### format 변수 제거하기
임시변수는 나중에 문제를 일으킬 수 있다.  
임시 변수는 자신이 속한 루틴에서만 의미가 있어서 루틴이 길고 복잡해지기 쉽다.  
따라서 리팩터링을 통해 이런 변수들을 제거하자.  
`format`은 임시변수에 함수 포인터처럼 함수를 대입한 형태인데,
저자는 함수를 직접 선언해 사용하도록 바꾸는 편이다.

함수 변수
```javascript
const format = new Intl.NumberFormat("en-US", {style: "currency", currency:"USD", minimumFractionDigits: 2}).format;
```
-->  
일반 함수
```javascript
function format(aNumber: any) {
  return new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2}).format(aNumber/100);
}
```
+ 함수 이름 바꾸기 `format() -> usd()`
+ 단위 변환 로직(`/100`)도 `format()` 함수 안으로 이동

---

### volumeCredits 변수 제거하기
`volumeCredits`은 반복문을 돌 때마다 값을 누적하기 때문에 리팩터링하기 더 까다롭다.  
따라서 **반복문 쪼개기**로 `volumeCredits`의 누적되는 부분을 따로 뺀다.

`for`문 생성

먼저 관련된 문장을 한 곳으로 모아 놓고  
`let volumeCredits = 0;` -> 변수 선언(초기화)을 반복문 앞으로 이동

함수로 추출한다.(`totalVolumeCredits()`)

추출이 끝났다면 변수를 인라인한다.


여기서 잠시 생각해보자.  
반복문을 쪼개서(중복생성해서) 성능이 느려지지 않을까 걱정할 수 있다.  
이처럼 반복문이 중복되는 것을 꺼리는 이들이 많지만, 이 정도 중복은 성능에 미치는 영향은 미미할 때가 많다.  
실제로 리팩터링 전 후의 실행 시간을 측정해보면 차이를 거의 느끼지 못할 것이다.  
경험 많은 프로그래머조차 코드의 실제 성능을 정확히 예측하지 못한다.  
똑똑한 컴파일러들은 최신 캐싱 기법 등으로 무장하고 있어서 우리의 직관을 초월하는 결과를 내어준다.

하지만 저자(마틴)는 리팩터링으로 인해 성능에 영향이 있더라도 개의치 않고 리팩터링한다.  
잘 다듬어진 코드여야 나중에 개선 작업을 하더라도 수월하기 때문이다.  
리팩터링 과정으로 인해 성능이 크게 떨어졌다면 리팩터링 후 시간을 내어 성능을 개선한다.  

`volumeCredits 변수 제거하기` 단계는 작게 4단계로 나눴다.

`기존`
```javascript
let volumeCredits = 0;

for (let perf of invoice.performances) {

  volumeCredits += volumeCreditsFor(perf);

  // 청구 내역을 출력한다.
  result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
  totalAmount += amountFor(perf);
}
result += `\n총액: ${usd(totalAmount)}\n`
result += `적립 포인트: ${volumeCredits}점`;
```
**1. `반복문 쪼개기(8.7)`로 변수 값을 누적시키는 부분을 분리한다.**
```javascript
let volumeCredits = 0;

for (let perf of invoice.performances) {
  // 청구 내역을 출력한다.
  result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
  totalAmount += amountFor(perf);
}

for (let perf of invoice.performances) { // 반복문 분리
  volumeCredits += volumeCreditsFor(perf);
}
result += `\n총액: ${usd(totalAmount)}\n`
result += `적립 포인트: ${volumeCredits}점`;
```
**2. `문장 슬라이드하기(8.6)`로 변수 초기화 문장을 변수 값 누적 코드 바로 앞으로 옮긴다.**
```javascript
// let volumeCredits = 0; 아래로 이동

for (let perf of invoice.performances) {
  // 청구 내역을 출력한다.
  result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
  totalAmount += amountFor(perf);
}

let volumeCredits = 0; // 누적 코드 바로 앞
for (let perf of invoice.performances) {
  volumeCredits += volumeCreditsFor(perf);
}
result += `\n총액: ${usd(totalAmount)}\n`
result += `적립 포인트: ${volumeCredits}점`;
```
**3. `함수 추출하기(6.1)`로 적립 포인트 계산 부분을 별도 함수로 추출한다.**
```javascript
for (let perf of invoice.performances) {
  // 청구 내역을 출력한다.
  result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
  totalAmount += amountFor(perf);
}

let volumeCredits = totalVolumeCredits(); // 함수 추출
result += `\n총액: ${usd(totalAmount)}\n`
result += `적립 포인트: ${volumeCredits}점`;

function totalVolumeCredits() {
  let volumeCredits = 0;
  for (let perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf);
  }
  return volumeCredits;
}
```
**4. `변수 인라인하기(6.4)`로 `volumeCredits` 변수를 제거한다.**
```javascript
for (let perf of invoice.performances) {
  // 청구 내역을 출력한다.
  result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
  totalAmount += amountFor(perf);
}

result += `\n총액: ${usd(totalAmount)}\n`
result += `적립 포인트: ${totalVolumeCredits()}점`; // 변수 인라인

function totalVolumeCredits() {
  let volumeCredits = 0;
  for (let perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf);
  }
  return volumeCredits;
}
```

항상 단계를 이처럼 나누는 것은 아니지만 상황이 복잡하다면 단계를 더 작게 나누는 일을 가장 먼저 한다.

---

`totalAmount` 임시변수도 `volumeCredits` 동일하게 4단계를 진행한다.

---

## 중간점검
이제 `statement()` 최상위 함수는 7줄로 줄었고 출력할 문장을 생성하는 역할만 있다.

계산 로직은 모두 여러 개의 보조함수로 뺐다.  
결과적으로 각 계산 과정은 물론 전체 흐름을 이해하기 훨씬 쉬워졌다.

지금까지는 프로그램의 논리적인 요소를 파악하기 쉽도록 코드의 구조를 보강하는 데 주안점을 두고 리팩터링했다.  
복잡하게 얽힌 덩어리를 잘게 쪼개는 작업은 이름을 잘 짓는 일만큼 중요하다.

---

골격은 충분히 개선되었으니 원하는 기능 변경인 `statement()`의 `HTML`버전 만드는 작업을 보자.

계산코드가 전부 분리 되었기 때문에 최상단 코드 `statement()`에 `HTML`버전만 작성하면 된다.

그러나 현재는 `TEXT`버전이 있어 이를 `HTML | TEXT` 로 나눠야한다.

가장 쉬운 방법은 코드를 똑같이 복붙하면 되지만 비효율 적이기에 이럴때는 `단계 쪼개기(6.11)`로 리팩터링한다.

목표는 `statement()`를 두 단계로 나누는 것이다.
1. `statement()`에서 필요한 데이터를 처리
2. 1번에서 처리한 결과를 `HTML | TEXT`로 표시

### 계산 단계와 포맷팅 단계 분리하기
1. 함수추출(본문 전체를 별도 함수로 추출)
2. 중간 데이터 구조를 인수로 전달
