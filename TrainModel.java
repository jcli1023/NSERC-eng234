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
		BufferedReader datafile = readDataFile("train_traj_data_backup.txt");

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

