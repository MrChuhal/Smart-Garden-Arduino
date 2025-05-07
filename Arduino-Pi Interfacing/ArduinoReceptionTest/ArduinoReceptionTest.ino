int received = 0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  // Read A0 value and send on serial every second
  int sensorValue = analogRead(A0);
  Serial.println(sensorValue);
  delay(100);
}
