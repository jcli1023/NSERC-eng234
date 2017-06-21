
import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;

import weka.clusterers.SimpleKMeans;
import weka.clusterers.ClusterEvaluation;
import weka.core.Instance;
import weka.core.Instances;
import weka.filters.Filter;
import weka.filters.unsupervised.attribute.Remove;

public class ClusterWeka {

	public static BufferedReader readDataFile(String filename) {
		BufferedReader inputReader = null;

		try {
			inputReader = new BufferedReader(new FileReader(filename));
		} catch (FileNotFoundException ex) {
			System.err.println("File not found: " + filename);
		}

		return inputReader;
	}

	public static void main(String[] args) throws Exception {
		SimpleKMeans kmeans = new SimpleKMeans();

		kmeans.setSeed(10);

		//important parameter to set: preserver order, number of cluster.
		kmeans.setPreserveInstancesOrder(true);
		kmeans.setNumClusters(3);

		BufferedReader datafile = readDataFile("test_traj_data_backup.txt"); 
//		BufferedReader datafile = readDataFile("train_traj_data_backup.txt");
		Instances data = new Instances(datafile);
		data.setClassIndex(data.numAttributes()-1);

		String[] options = new String[2];
		options[0] = "-R";                                    // "range"
		options[1] = "121";                                     // last attribute
		Remove remove = new Remove();                         // new instance of filter
		remove.setOptions(options);                           // set options
		remove.setInputFormat(data);                          // inform filter about dataset **AFTER** setting options
		Instances newData = Filter.useFilter(data, remove);   // apply filter

//		System.out.println(data.numAttributes());

	
		
		kmeans.buildClusterer(newData);
		
		ClusterEvaluation eval = new ClusterEvaluation();
	        eval.setClusterer(kmeans);
		eval.evaluateClusterer(newData);
	
		//System.out.println("Cluster Results \n =================== \n "+eval.clusterResultsToString()+ ";");

		
		// This array returns the cluster number (starting with 0) for each instance
		// The array has as many elements as the number of instances
		int[] assignments = kmeans.getAssignments();


		int totalInstances = newData.numInstances();	
		int confusionMatrix[][] = new int[kmeans.numberOfClusters()][3];

		for (int i = 0; i < totalInstances; i++)
		{
			int instanceClass = (int) data.get(i).value(data.classIndex());
			int clusteredClass = assignments[i];
			confusionMatrix[clusteredClass][instanceClass]++;
		}

//		for (int i = 0; i < confusionMatrix.length; i++)
//		{
//			for (int j = 0; j < confusionMatrix[0].length; j++)
//			{
//				System.out.print(confusionMatrix[i][j]+" ");
//			}
//			System.out.println();
//		}


		int correctlyClustered = 0;
		for (int i = 0; i < confusionMatrix.length; i++)
		{
			int maxInstances = 0;
			maxInstances = confusionMatrix[i][0];

			for (int j = 0; j < confusionMatrix[0].length; j++)
			{
				if (confusionMatrix[i][j] > maxInstances)
				{
					maxInstances = confusionMatrix[i][j];
				}				
			}
			
			correctlyClustered+= maxInstances;
		}
	

//		System.out.println(newData.numAttributes());
//		System.out.println(newData.numInstances());
//		for (int j = 0; j < newData.numInstances(); j++)
//		{
//			Instance currentInstance = newData.instance(j);
//			for (int k = 0; k < newData.numAttributes(); k++)
//			{
//				if (k == newData.numAttributes()-1)
//					System.out.print(currentInstance.value(k));
//				else
//				System.out.print(currentInstance.value(k)+",");
//			}
//			System.out.println();
//		}

		int movementNum=0;
		for(int clusterNum : assignments) {
			//   System.out.printf("Instance %d -> Cluster %d \n", i, clusterNum);
			//System.out.printf("%d \n", clusterNum);
			movementNum++;
			if ( (movementNum%10) == 0 )
				System.out.println("Movement "+ movementNum + ": " + clusterNum + ";");
			else
				System.out.println("Movement "+ movementNum + ": " + clusterNum);
		}
		
	
		System.out.println("correctlyClustered: "+correctlyClustered + " totalInstances: "+totalInstances + ";");
		double accuracy = (double)correctlyClustered / totalInstances * 100;
		System.out.println("Accuracy: "+ accuracy + "%");
	}
}

