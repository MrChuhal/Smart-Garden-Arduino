int received = 0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  if (Serial.available() > 0) {
    received = Serial.parseInt(); // Use parseInt directly
    Serial.println(received + 1);
  }
}
