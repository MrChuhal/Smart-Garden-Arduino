int pumpPin = 2;  // Connect your pump relay to pin 8

void setup() {
  Serial.begin(9600);
  pinMode(pumpPin, OUTPUT);
  digitalWrite(pumpPin, LOW); // Make sure pump is off initially
}

void loop() {
  // Read analog inputs
  int a0 = analogRead(A0);
  int a1 = analogRead(A1);
  int a2 = analogRead(A2);
  int a3 = analogRead(A3);

  // Output as CSV: A0,A1,A2,A3
  Serial.print(a0); Serial.print(",");
  Serial.print(a1); Serial.print(",");
  Serial.print(a2); Serial.print(",");
  Serial.println(a3);

  // Check for serial input
  if (Serial.available() > 0) {
    char input = Serial.read();
    if (input == '1') {
      digitalWrite(pumpPin, HIGH);  // Turn pump ON
    } else if (input == '0') {
      digitalWrite(pumpPin, LOW);   // Turn pump OFF
    }
  }

  delay(100);
}
