## 임시 변수 제거 후 인라인 처리

### play 변수 제거
인라인 처리 playFor()  
amountFor()의 매개변수 play는 변경되는 값은 아니다.

### thisAmount 변수 제거
인라인 처리 amountFor(perf)

공연 조회 loop 당 1회 -> loop 당 3회  
성능 큰영향x, 리팩터링된 코드는 성능 개선이 훨씬 쉬워짐  
=> 추출 작업 전 지역변수를 먼저 없앰. - 신경써야할 유효범위가 줄음
