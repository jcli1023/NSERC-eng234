import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;

import weka.classifiers.Classifier;
import weka.classifiers.Evaluation;
import weka.classifiers.evaluation.NominalPrediction;
import weka.classifiers.functions.SMO;
import weka.classifiers.meta.FilteredClassifier;
import weka.classifiers.rules.DecisionTable;
import weka.classifiers.rules.PART;
import weka.classifiers.trees.DecisionStump;
import weka.classifiers.trees.J48;
import weka.core.FastVector;
import weka.core.Instances;
import weka.filters.unsupervised.attribute.Remove;

public class TrainModel {

	public static final int REGULAR_DATASET = 0;
	public static final int REGULAR_DELTA_DATASET = 1;
	public static final int ORIENTATIONS_DATASET = 2;
	public static final int ORIENTATIONS_DELTA_DATASET = 3;
	public static final int USER_DATASET = 4;

	public static BufferedReader readDataFile(String filename) {
		BufferedReader inputReader = null;

		try {
			inputReader = new BufferedReader(new FileReader(filename));
		} catch (FileNotFoundException ex) {
			System.err.println("File not found: " + filename);
		}

		return inputReader;
	}

	public static Evaluation classify(Classifier model,
			Instances trainingSet, Instances testingSet) throws Exception {
		Evaluation evaluation = new Evaluation(trainingSet);

		model.buildClassifier(trainingSet);
		evaluation.evaluateModel(model, testingSet);

		return evaluation;
	}

	public static double calculateAccuracy(FastVector predictions) {
		double correct = 0;

		for (int i = 0; i < predictions.size(); i++) {
			NominalPrediction np = (NominalPrediction) predictions.elementAt(i);
			if (np.predicted() == np.actual()) {
				correct++;
			}
		}

		return 100 * correct / predictions.size();
	}



	public static void main(String[] args) throws Exception {

		int datasetOption = REGULAR_DATASET;

		if (args.length > 0)
		{
			datasetOption = Integer.parseInt(args[0]);
		}

		String pathToTrainingDataset;

		if (datasetOption == REGULAR_DATASET)
		{
			pathToTrainingDataset = "train_traj_data_backup.txt";
		}
		else if (datasetOption == REGULAR_DELTA_DATASET)
		{
			pathToTrainingDataset = "deltaRegular-Train.txt";
		}
		else if (datasetOption == ORIENTATIONS_DATASET)
		{
			pathToTrainingDataset = "trainDiffOrientations.txt";
		}
		else if (datasetOption == ORIENTATIONS_DELTA_DATASET)
		{
			pathToTrainingDataset = "deltaTrainDifferentOrientation.txt";
		}
		else if (datasetOption == USER_DATASET)
		{
			pathToTrainingDataset = "user_train_traj_data.txt";
		}


		BufferedReader datafile = readDataFile(pathToTrainingDataset);

		Instances data = new Instances(datafile);

//		Remove remove = new Remove();                
//		remove.setAttributeIndices("last");
//		FilteredClassifier fc = new FilteredClassifier();
//		fc.setFilter(remove);
		
		data.setClassIndex(data.numAttributes() - 1);

		// Use a set of classifiers
		Classifier[] models = { 
				new J48(), // a decision tree
				new PART(), 
				new DecisionTable(),//decision table majority classifier
				new DecisionStump(), //one-level decision tree
				new SMO()
		};

		// Run for each model
		for (int j = 0; j < models.length; j++) {

			// Collect every group of predictions for current model in a FastVector
			FastVector predictions = new FastVector();

			// For each training-testing split pair, train and test the classifier
			//for (int i = 0; i < trainingSplits.length; i++) {
			//	Evaluation validation = classify(models[j], trainingSplits[i], testingSplits[i]);

			//	predictions.appendElements(validation.predictions());

			// Uncomment to see the summary for each training-testing pair.
			//System.out.println(models[j].toString());
//			fc.setClassifier(models[j]);
//			fc.buildClassifier(data);
			models[j].buildClassifier(data);
			// evaluate classifier and print some statistics
		}
		
		weka.core.SerializationHelper.write("trained_models.txt", models);

	}


}

