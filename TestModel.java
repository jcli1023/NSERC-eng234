import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
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

public class TestModel {

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

		String pathToTrainingDataset = "";

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
//		BufferedReader testfile = readDataFile("test_traj_data_backup.txt");
		BufferedReader testfile = readDataFile("test_traj_data.txt");

		Instances data = new Instances(datafile);
		Instances test = new Instances(testfile);
		
		Remove remove = new Remove();                
		remove.setAttributeIndices("last");
		FilteredClassifier fc = new FilteredClassifier();
		fc.setFilter(remove);

		FilteredClassifier svmFiltered = new FilteredClassifier();
		
//		data.setClassIndex(data.numAttributes() - 2);
//		test.setClassIndex(test.numAttributes() - 2);
		data.setClassIndex(data.numAttributes() - 1);
		test.setClassIndex(test.numAttributes() - 1);

		// Use a set of classifiers
		Classifier[] models = { 
				new J48(), // a decision tree
				new PART(), 
				new DecisionTable(),//decision table majority classifier
				new DecisionStump(), //one-level decision tree
				new SMO()
		};

		 models = (Classifier[]) weka.core.SerializationHelper.read("trained_models.txt");
		
		// Run for each model
		for (int j = 0; j < models.length; j++) {

			// Collect every group of predictions for current model in a FastVector
			FastVector predictions = new FastVector();

//			fc.setClassifier(models[j]);
//			fc.buildClassifier(data);
			
//			if (j == models.length - 1)
//				svmFiltered = fc;
			
			// evaluate classifier and print some statistics
			Evaluation eval = new Evaluation(data);
//			eval.evaluateModel(fc, test);
			eval.evaluateModel(models[j], test);
			predictions.appendElements(eval.predictions());


//			System.out.println("\n"+models[j].getClass().getSimpleName()+" Predictions");

			// create copy
			Instances predictedLabels = new Instances(test);

			// label instances
			for (int i = 0; i < test.numInstances(); i++) {
				double clsLabel = models[j].classifyInstance(test.instance(i));
//				double clsLabel = fc.classifyInstance(test.instance(i));
				predictedLabels.instance(i).setClassValue(clsLabel);
				//				System.out.println(predictedLabels.instance(i).toString());
//				System.out.println(i+": "+predictedLabels.instance(i).stringValue(data.numAttributes()-1));
			}



//			System.out.println(eval.toSummaryString("\nResults "+models[j].getClass().getSimpleName()+"\n======\n", false));
			

			// Calculate overall accuracy of current classifier on all splits
			double accuracy = calculateAccuracy(predictions);

//			// Print current classifier's name and accuracy in a complicated,
//			// but nice-looking way.
//			System.out.println("Accuracy of " + models[j].getClass().getSimpleName() + ": "
//					+ String.format("%.2f%%", accuracy)
//					+ "\n---------------------------------");
		}
		
		// create copy
		Instances predictedLabels = new Instances(test);
		
		// for SMO/SVM
		for (int i = 0; i < test.numInstances(); i++) {
//			double clsLabel = svmFiltered.classifyInstance(test.instance(i));
			double clsLabel = models[4].classifyInstance(test.instance(i));
			predictedLabels.instance(i).setClassValue(clsLabel);
			if (i == test.numInstances()-1)
			{
//				System.out.println(predictedLabels.instance(i).stringValue(data.numAttributes()-2));
				System.out.println(predictedLabels.instance(i).stringValue(data.numAttributes()-1));
			}
		}
	}
}
