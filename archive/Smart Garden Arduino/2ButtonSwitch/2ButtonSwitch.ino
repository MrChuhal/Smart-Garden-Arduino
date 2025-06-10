//Dual Button Swtich  https://wiki.seeedstudio.com/Grove-Dual-Button/ - Alex P


int button1 = 3; //set the button1 pin
int button2 = 4; //set the button2 pin
bool state1 = 1; //set button1 state
bool state2 = 1; //set button2 state
void setup()
{
  pinMode(button1,INPUT);
  pinMode(button2,INPUT);
  Serial.begin(9600);
}
 
 void loop()
 {
  //The button gives 0 when pressed and 1 when not pressed
  state1 = digitalRead(button1);
  state2 = digitalRead(button2);
  Serial.print("button1: "); Serial.println(state1);
  Serial.print("button2: "); Serial.println(state2);
  delay(500);
  
 }