# Refactoring_v2 by Martin Fowler

다양한 연극을 외주로 받아서 공연하는 극단이 있다.

연극의 장르와 관객 규모를 기초로 비용을 책정한다.  
현재는 비극(tragedy)과 희극(comedy)만 공연한다.

공연료와 별개로 포인트를 지급해서 다음번 의뢰 시 공연료를 할인 받을 수 있다.

## 함수 추출하기(6.1)
amountFor()

## 임시 변수를 질의 함수로 바꾸기(7.4)
play, thisAmount 변수 제거

## 변수 인라인 처리(6.4)
play -> playFor(), thisAmount -> amountFor()
