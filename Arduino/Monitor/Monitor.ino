#define encoder0PinA 2
#define encoder0PinB 3

#include <SoftwareSerial.h>

int encoder0Pos = 0;

int valRotary,lastValRotary;

SoftwareSerial mySerial(10, 11); // RX, TX

void setup() {
  pinMode(encoder0PinA, INPUT_PULLUP);
  pinMode(encoder0PinB, INPUT_PULLUP);
  attachInterrupt(0, doEncoder, CHANGE);
  
  mySerial.begin(9600);
}

void loop() {
   lastValRotary = valRotary;
   delay(250);

    
   if (encoder0Pos < 0) encoder0Pos = -encoder0Pos;
   encoder0Pos *= 5;
   if (encoder0Pos > 254) encoder0Pos = 254;
   mySerial.write(encoder0Pos);
   
   encoder0Pos = 0;
}
void doEncoder()
{
  if (digitalRead(encoder0PinA) == digitalRead(encoder0PinB))
  {
    encoder0Pos++;
  }
  else
  {
    encoder0Pos--;
  }
  valRotary = encoder0Pos/2.5;
}
