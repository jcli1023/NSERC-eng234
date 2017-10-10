#!/usr/bin/env python3

import pandas as pd
import tensorflow as tf
import matplotlib.pyplot as plt
import numpy as np
import sys
from datetime import datetime

start = datetime.now()

classes = {"Half-Circle": 0, "Line": 1, "Sine": 2}

learning_rate = 0.01
number_of_iterations = 1000

REGULAR_DATASET = "0"
REGULAR_DELTA_DATASET = "1"
ORIENTATIONS_DATASET = "2"
ORIENTATIONS_DELTA_DATASET = "3"
USER_DATASET = "4"

if sys.argv[2] == REGULAR_DATASET:
	pathToTrainingDataset = "train_traj_data_backup.txt"
	pathToTestDataset = "test_traj_data_regular_batch.txt" 
elif sys.argv[2] == REGULAR_DELTA_DATASET:
	pathToTrainingDataset = "deltaRegular-Train.txt"
	pathToTestDataset = "test_traj_data_regular_delta_batch.txt"
elif sys.argv[2] == ORIENTATIONS_DATASET:
	pathToTrainingDataset = "trainDiffOrientations.txt"
	pathToTestDataset = "test_traj_data_orientations_batch.txt"
elif sys.argv[2] == ORIENTATIONS_DELTA_DATASET:
	pathToTrainingDataset = "deltaTrainDifferentOrientation.txt"
	pathToTestDataset = "test_traj_data_orientations_delta_batch.txt"
elif datasetOption == USER_DATASET:
	pathToTrainingDataset = "user_train_traj_data.txt"
	pathToTestDataset = "test_traj_data_user_batch.txt"

#train = pd.read_table("sepideh_train.txt", skiprows=126, header=None, sep=",")
train = pd.read_table(pathToTrainingDataset, skiprows=126, header=None, sep=",")
Y_train = train[120]
Y_train = Y_train.replace((classes))
X_train = train
del X_train[120]
X_train = X_train.transpose()
Y_train = Y_train.values.reshape(len(Y_train), 1).transpose()
Y_train = np.eye(3)[Y_train.reshape(-1)].T

#test = pd.read_table("sepideh_test.txt", skiprows=126, header=None, sep=",")
test = pd.read_table(pathToTestDataset, skiprows=126, header=None, sep=",")
Y_test = test[120]
Y_test = Y_test.replace((classes))
X_test = test
del X_test[120]
X_test = X_test.transpose()
Y_test = Y_test.values.reshape(len(Y_test), 1).transpose()
Y_test = np.eye(3)[Y_test.reshape(-1)].T


input_layer_size, number_of_training_examples = X_train.shape
hidden_layer_1_size = 10
hidden_layer_2_size = 10
hidden_layer_3_size = 10
output_layer_size = Y_train.shape[0]
costs = []
X = tf.placeholder(tf.float32, shape=(input_layer_size, None))
Y = tf.placeholder(tf.float32, shape=(output_layer_size, None))

if sys.argv[1] == "hidden":
	W1 = tf.get_variable("W1", [hidden_layer_1_size, input_layer_size], initializer=tf.contrib.layers.xavier_initializer(seed=0))
	b1 = tf.get_variable("b1", [hidden_layer_1_size, 1], initializer=tf.zeros_initializer())
	W2 = tf.get_variable("W2", [hidden_layer_2_size, hidden_layer_1_size], initializer=tf.contrib.layers.xavier_initializer(seed=0))
	b2 = tf.get_variable("b2", [hidden_layer_2_size, 1], initializer=tf.zeros_initializer())
	W3 = tf.get_variable("W3", [hidden_layer_3_size, hidden_layer_2_size], initializer=tf.contrib.layers.xavier_initializer(seed=0))
	b3 = tf.get_variable("b3", [hidden_layer_3_size, 1], initializer=tf.zeros_initializer())
	W4 = tf.get_variable("W4", [output_layer_size, hidden_layer_3_size], initializer=tf.contrib.layers.xavier_initializer(seed=0))
	b4 = tf.get_variable("b4", [output_layer_size, 1], initializer=tf.zeros_initializer())
	Z1 = tf.add(tf.matmul(W1, X), b1)
	A1 = tf.nn.softplus(Z1)
	Z2 = tf.add(tf.matmul(W2, A1), b2)
	A2 = tf.nn.elu(Z2)
	Z3 = tf.add(tf.matmul(W3, A2), b3)
	A3 = tf.nn.softplus(Z3)
	Z4 = tf.add(tf.matmul(W4, A3), b4)
	cost = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(logits=tf.transpose(Z4), labels=tf.transpose(Y)))
	optimizer = tf.train.AdamOptimizer(learning_rate=learning_rate).minimize(cost)
	initialize = tf.global_variables_initializer()
	with tf.Session() as sess:
		sess.run(initialize)
		for iteration in range(number_of_iterations):
			count = 0
			iteration_cost = 0
			__, batch_cost = sess.run([optimizer, cost], feed_dict={X: X_train, Y: Y_train})
			costs.append(batch_cost)
		correct_prediction = tf.equal(tf.argmax(Z4), tf.argmax(Y))
		accuracy = tf.reduce_mean(tf.cast(correct_prediction, "float"))
		#print(X_train.shape)
		#print(Y_train.shape)
		print("Train Accuracy:", accuracy.eval({X: X_train, Y: Y_train}), ";")
		print("Test Accuracy:", accuracy.eval({X: X_test, Y: Y_test}), ";")
		#plt.figure()
		#plt.plot(costs)
		#plt.show()
else:
	W1 = tf.get_variable("W1", [output_layer_size, input_layer_size], initializer=tf.contrib.layers.xavier_initializer(seed=0))
	b1 = tf.get_variable("b1", [output_layer_size, 1], initializer=tf.zeros_initializer())
	Z1 = tf.add(tf.matmul(W1, X), b1)
	cost = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(logits=tf.transpose(Z1), labels=tf.transpose(Y)))
	optimizer = tf.train.AdamOptimizer(learning_rate=learning_rate).minimize(cost)
	initialize = tf.global_variables_initializer()
	with tf.Session() as sess:
		sess.run(initialize)
		for iteration in range(number_of_iterations):
			count = 0
			iteration_cost = 0
			__, batch_cost = sess.run([optimizer, cost], feed_dict={X: X_train, Y: Y_train})
			costs.append(batch_cost)
		correct_prediction = tf.equal(tf.argmax(Z1), tf.argmax(Y))
		accuracy = tf.reduce_mean(tf.cast(correct_prediction, "float"))
		print("Train Accuracy:", accuracy.eval({X: X_train, Y: Y_train}))
		print("Test Accuracy:", accuracy.eval({X: X_test, Y: Y_test}))
		plt.figure()
		plt.plot(costs)
		plt.show()

print(datetime.now() - start)
