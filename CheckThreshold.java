

import java.io.File;
import java.lang.reflect.Field;
import java.util.ArrayList;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfPoint;
import org.opencv.core.MatOfPoint2f;
import org.opencv.core.Point;
import org.opencv.core.Scalar;
import org.opencv.core.Size;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;

public class CheckThreshold {

	private static final String EXTENSION_JPEG = ".jpg";

	//args: cameraNum timeName dimX dimY pathJSON
	public static void main(String[] args) {

		try {

			//long startTime = System.nanoTime();
			System.setProperty("java.library.path", "lib/x64");

			Field fieldSysPath = ClassLoader.class.getDeclaredField("sys_paths");
			fieldSysPath.setAccessible(true);
			fieldSysPath.set(null, null);

			System.loadLibrary(Core.NATIVE_LIBRARY_NAME);

			double hMin, hMax;
			String folderName = "CAMERA-" + args[0] + "/";
			String fileName = args[1] + EXTENSION_JPEG;			
			String pathName = folderName + fileName;
			//String pathName = getLatestFileFromDir(folderName).toString();

			double ratioX = Double.valueOf(args[2]);
			double ratioY = Double.valueOf(args[3]);

			JSONParser parser = new JSONParser();
			Object obj;

			try {
				obj = parser.parse(args[4]);
				JSONArray array = (JSONArray) obj;
				JSONObject obj2 = (JSONObject) array.get(1);
				JSONArray segments = (JSONArray) obj2.get("segments");
//				JSONObject hMinMax = (JSONObject) array.get(2);
//				JSONArray hMinMaxValues = (JSONArray) hMinMax.get("hMinMax");
//				JSONObject objectFound = (JSONObject) array.get(3);
				JSONObject minValues = (JSONObject) array.get(2);
				JSONArray minArray = (JSONArray) minValues.get("minValues");
				JSONObject maxValues = (JSONObject) array.get(3);
				JSONArray maxArray = (JSONArray) maxValues.get("maxValues");
				JSONObject objectFound = (JSONObject) array.get(4);
				JSONObject trajectoryCenter = (JSONObject) array.get(5);
				JSONArray trajectoryArray = (JSONArray) trajectoryCenter.get("trajectoryCenter");
				
//				hMin = (double) hMinMaxValues.get(0);
//				hMax = (double) hMinMaxValues.get(1);

				Mat rgbImage = Imgcodecs.imread(pathName);
				Mat hsv = new Mat();
				Imgproc.cvtColor(rgbImage, hsv, Imgproc.COLOR_RGB2HSV);

				//Create a mask for thresholding the object HSV
				Mat objectThresholdMask = new Mat();
//				Scalar lowerBound = new Scalar(hMin,100,100);
//				Scalar upperBound = new Scalar(hMax,255,255);
				Scalar lowerBound = new Scalar((double)minArray.get(0),(double)minArray.get(1),(double)minArray.get(2));
				Scalar upperBound = new Scalar((double)maxArray.get(0),(double)maxArray.get(1),(double)maxArray.get(2));
				Core.inRange(hsv,lowerBound,upperBound,objectThresholdMask);

				int erosionSize = 2;
				int dilationSize = 2;

				//Erode the objectThresholdMask to remove small noise
				Mat element = Imgproc.getStructuringElement(Imgproc.MORPH_RECT, new Size(2*erosionSize + 1, 2*erosionSize+1));
				Imgproc.erode(objectThresholdMask, objectThresholdMask, element);

				//Dilate the objectThresholdMask to fill in small holes
				Mat element1 = Imgproc.getStructuringElement(Imgproc.MORPH_RECT, new  Size(2*dilationSize + 1, 2*dilationSize+1));
				Imgproc.dilate(objectThresholdMask, objectThresholdMask, element1);

				//Mask after eroding then dilating
				Mat finalThresholdMask = new Mat(objectThresholdMask.rows(), objectThresholdMask.cols(), CvType.CV_8UC1, new Scalar(0));
				objectThresholdMask.copyTo(finalThresholdMask);

				//List of contours
				ArrayList<MatOfPoint> contours = new ArrayList<MatOfPoint>();
				Mat hierarchy = new Mat(); 
				Imgproc.findContours(finalThresholdMask, contours, hierarchy, Imgproc.RETR_EXTERNAL, Imgproc.CHAIN_APPROX_NONE);

				double largestContourArea = 0.0;
				double currentContourArea = 0.0;
				int largestContourIndex = 0;			

				//Find the largest contour based on its area
				for( int i = 0; i< contours.size(); i++ )
				{
					currentContourArea = Imgproc.contourArea( contours.get(i),false); 

					if(currentContourArea > largestContourArea){
						largestContourArea = currentContourArea;
						largestContourIndex=i;               
					}
				}

				//Clear the segments for new contour or remain empty if no contour
				segments.clear();

				//A contour is found, otherwise no contour
				if (contours.size() > 0)
				{
					for( int i = 0; i< contours.size(); i++ )
					{
						currentContourArea = Imgproc.contourArea( contours.get(i),false); 

						if(currentContourArea > largestContourArea){
							largestContourArea = currentContourArea;
							System.out.println("largestContourArea: "+largestContourArea);
							largestContourIndex=i;               
						}
					}
					
					//Find the minEnclosingCircle of largest contour
					MatOfPoint2f  contourEnclosing = new MatOfPoint2f( contours.get(largestContourIndex).toArray() );
					Point center = new Point();
					float[] radius = new float[1];
					Imgproc.minEnclosingCircle(contourEnclosing, center, radius);
					
					trajectoryArray.clear();
					long centerX, centerY;
					//map center coordinates to approximal html coordinates (/ ratio)
					centerX = ((Double)(center.x / ratioX)).longValue();
					centerY = ((Double)(center.y / ratioX)).longValue();
					trajectoryArray.add(centerX);
					trajectoryArray.add(centerY);
					
//					Mat drawing2 = new Mat(hsv.rows(),hsv.cols(),CvType.CV_8UC1, new Scalar(1,1,0));
//				Scalar color = new Scalar( 0, 0, 100 );
//				Imgproc.drawContours(drawing2, contours, largestContourIndex, color, 2, 8, hierarchy, 0, new Point() );
//				Mat imageTest2 = new Mat(hsv.rows(), hsv.cols(), CvType.CV_8UC3, new Scalar(1,1,0));
//				hsv.copyTo(imageTest2,drawing2);
//				Imgcodecs.imwrite("contourOverlay_checkthreshold_"+fileName,imageTest2);

					//Points of the contour detected by threshold
					Point[] maxContourPoints = contours.get(largestContourIndex).toArray();

					long xContour, yContour;

					//map the contour coordinates to the approximate html coordinates (/ ratio)
					for (int i = 0; i < maxContourPoints.length; i++)
					{
						JSONArray contourPoints = new JSONArray();
						xContour = ((Double)(maxContourPoints[i].x / ratioX)).longValue();
						yContour = ((Double)(maxContourPoints[i].y / ratioY)).longValue();
						contourPoints.add(xContour);
						contourPoints.add(yContour);
						segments.add(contourPoints);
					}

					objectFound.put("objectFound", "true");

				}
				else
					objectFound.put("objectFound", "false");

				System.out.println(array.toJSONString());
				//long endTime = System.nanoTime();
				//System.out.println(endTime-startTime);
			}catch (ParseException e) {
				e.printStackTrace();
			}

		} catch (Exception ex) {
			ex.printStackTrace();
			throw new RuntimeException(ex);
		}

	}
	


	public static File getLatestFileFromDir(String dirPath){
	    File dir = new File(dirPath);
	    File[] files = dir.listFiles();
	    if (files == null || files.length == 0) {
	        return null;
	    }
	
	    File lastModifiedFile = files[0];
	    for (int i = 1; i < files.length; i++) {
	       if (lastModifiedFile.lastModified() < files[i].lastModified()) {
	           lastModifiedFile = files[i];
	       }
	    }
	    return lastModifiedFile;
	}


}
