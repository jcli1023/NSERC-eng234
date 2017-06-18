#!/bin/bash
javac -cp lib/x64/json-simple-1.1.1.jar:lib/x64/opencv-310.jar: InitializeObject.java
javac -cp lib/x64/json-simple-1.1.1.jar:lib/x64/opencv-310.jar: CheckThreshold.java
javac -cp weka.jar: ClusterWeka.java
javac -cp weka.jar:libsvm.jar: SVMBatch.java
javac -cp weka.jar:libsvm.jar: TrainModel.java
javac -cp weka.jar:libsvm.jar: TestModel.java
