package kr.or.ih.api.service;

import java.util.List;

import kr.or.ih.api.entity.Crop;
import kr.or.ih.api.entity.Marker;
import kr.or.ih.api.entity.Outcome;

public interface MABCService
{
	
	int SelectOutcomeCount(String user_username);
	
	List<Outcome> SelectOutcomeList(String user_username, int offset, int limit);

	Outcome SelectMABCDetail(int outcome_id);

	Marker SelectMarkerFile(int marker_id);

	String SelectOutcomeResult(int outcome_id);

	List<Crop> SelectCrop();
}