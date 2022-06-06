package kr.or.ih.api.service.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import egovframework.rte.psl.dataaccess.mapper.Mapper;
import kr.or.ih.api.entity.Crop;
import kr.or.ih.api.entity.Marker;
import kr.or.ih.api.entity.MarkerFile;
import kr.or.ih.api.entity.Outcome;

@Mapper
public interface MarkerMapper
{
	// 작물 조회
	List<Crop> SelectCrop();

	// 마커 갯수 조회
	int SelectMarkerCount();

	// 마커 목록 조회
	List<Marker> SelectMarker(@Param("offset") int offset, @Param("limit") int limit);
	
	// 마커 상세 조회
	Marker SelectMarkerDetail(int marker_id);

	// 마커 파일 조회
	List<MarkerFile> SelectMarkerFile(int marker_id);
	
	int SelectOutcomeCount();
	
	int SelectUserOutcomeCount(@Param("user_username") String user_username);
	
	List<Outcome> SelectOutcomeList(@Param("offset") int offset, @Param("limit") int limit);
	
	List<Outcome> SelectUserOutcomeList(@Param("offset") int offset, @Param("limit") int limit, @Param("user_username") String user_username);	

	// 작물 중복 확인
	int CheckCrop(String new_crop);
	
	// 작물 등록
	int InsertCrop(String new_crop);
	
	// 마커정보 등록
	int InsertMarker(Marker marker);

	// 마커정보 수정
	int UpdateMarker(Marker marker);

	// 마커 파일 수정
	int UpdateMarkerFile(MarkerFile file);

	// 마커정보 파일 등록
	int InsertMarkerFile(MarkerFile file);

	// 작물별 버전 정보 조회
	List<Marker> SelectMarkerVersion(String marker_crop);
	
	List<Marker> SelectUseMarkerVersion(String marker_crop);

	// 결과 데이터 등록
	int InsertOutcome(Outcome outcome);

	// 결과 상세 조회
	Outcome SelectOutcomeDetail(int outcome_id);

	// 결과 수정
	int UpdateOutcome(Outcome outcome);

	int UpdateOutcomeResult(@Param("outcome_id") int outcome_id, @Param("outcome_result") String outcome_result);
}