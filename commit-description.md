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
