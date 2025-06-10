//Relay code copied from https://wiki.seeedstudio.com/Grove-Relay/ - Alex P

boolean state1 = 0;
boolean state2 = 0;
//Pertaining to state1
boolean on = 0;
boolean hold = 0;
void setup()
{
  //pin of the relay
  Serial.begin(9600);
  pinMode(5, OUTPUT);
  //pins of the button
  pinMode(6, INPUT);
  pinMode(7, INPUT);
}

void loop()
{
  //Turn relay on and off as button is pressed
  state1 = digitalRead(6);
  state2 = digitalRead(7);
  Serial.println(on);
  checkButton();
  if(on) {
    digitalWrite(5,HIGH);
  } else {
    digitalWrite(5,LOW);
  }
  
}

void checkButton() {
  if(!hold && !state2) {
    //button not having been held and beingp ressed
    on = !on;
    hold = 1;
  } else if(state2) {
    hold = 0;
  }
}