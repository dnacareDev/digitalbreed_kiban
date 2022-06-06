package kr.or.ih.api.service;

import java.util.List;

import kr.or.ih.api.entity.Crop;
import kr.or.ih.api.entity.Marker;
import kr.or.ih.api.entity.Outcome;

public interface NgsService
{
	int SelectOutcomeCount(String user_username);
	
	List<Outcome> SelectOutcomeList(String user_username, int offset, int limit);

	List<Crop> SelectCrop();
	
	List<Marker> SelectMarkerVersion(String marker_crop);
	
	String SelectMarkerFileName(int marker_id);

	Outcome SelectOutcome(int outcome_id);
}